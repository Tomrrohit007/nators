const AppError = require("../utils/appError");
const User = require("../model/userModel");
const catchAsync = require("../utils/catchError");
const handlerFactory = require("./handlerFactory");
const cloudinary = require("../utils/cloudinary");
const multer = require("multer");

// Uploading image and resizing it

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload a image", 400), false);
  }
};



const upload = multer({
  storage: multer.diskStorage({}),
  fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.single("image");

exports.hashImageUrl = catchAsync(async (req, res, next) => {
    if (!req.file) {
      return next();
    }
    const publicId = req.user.publicId;
    if (publicId) {
      cloudinary.uploader.destroy(publicId);
    }
  
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "user-images",
      format:"jpg",
      transformation: [
        { width: 400, height: 400, crop: "fill", gravity: "face", quality:75 }
      ]
    });
  
    req.user.publicId = result.public_id;
    req.user.imageUrl = result.secure_url;
    next();
});

exports.destroyUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.user.publicId) {
    return next(new AppError("User doesn't have any photo", 400));
  }
  await cloudinary.uploader.destroy(req.user.publicId);
  const doc = await User.findByIdAndUpdate(req.user.id, {
    image: "",
    publicId: "",
  });
  res.status(201).json({
    status: "deleted successfully",
  });
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
