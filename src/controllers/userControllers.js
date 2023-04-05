const AppError = require("../utils/appError");
const User = require("../model/userModel");
const catchAsync = require("../utils/catchError");
const handlerFactory = require("./handlerFactory");
const sharp = require("sharp");

const multer = require("multer");

// Uploading image and resizing it
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload a image", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.single("image");

exports.resizeImageBeforeUpload = catchAsync(async (req, res, next) => {
  if (!req.file) {
    next();
  }
  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500, { withoutEnlargement: true })
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);
  next();
});

exports.getAllUser = handlerFactory.getAll(User);
exports.getUser = handlerFactory.getOne(User);
exports.updateUserDetails = handlerFactory.updateOne(User);
exports.deleteUser = handlerFactory.deleteOne(User);

exports.getMe = async (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.deactivateUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user._id, { active: false });
  res.status(204).json({
    status: "success",
  });
});

exports.updateEmail = catchAsync(async (req, res, next) => {
  req.body = { email: req.body.email };
  next();
});
