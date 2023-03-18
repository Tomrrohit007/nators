const AppError = require("../utils/appError");
const User = require("../model/userModel");
const catchAsync = require("../utils/catchError");
const APIFeatures = require("../utils/apiFeature");

const getAllUser = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(User.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .pagination();

  const users = await features.query;
  return res.status(200).json({ count: users.length, users });
});

const updateUserDetails = catchAsync(async (req, res, next) => {
  const excludeArray = ["role"];
  excludeArray.forEach((el) => delete req.body[el]);

  if (req.body.password || req.body.confirmPassword) {
    next(new AppError("You cannot update Password"));
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    { ...req.body },
    {
      new: true,
      runValidators: true,
    }
  ).select("-passwordChangeAt, -__v");
  return res.status(200).json({
    status: "success",
    user: updatedUser,
  });
});

const deleteUser = catchAsync(async(req, res, next)=>{
  const user = await User.findByIdAndUpdate(req.user.id, {active:false})
  res.status(204).json({
    status:"success"
  })

})

module.exports = { getAllUser, updateUserDetails, deleteUser };
