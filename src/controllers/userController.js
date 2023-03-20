const AppError = require("../utils/appError");
const User = require("../model/userModel");
const catchAsync = require("../utils/catchError");
const APIFeatures = require("../utils/apiFeature");
const { updateOne, deleteOne, getOne, getAll } = require("./handlerFactory");

const getAllUser = getAll(User);
const getUser = getOne(User);
const updateUserDetails = updateOne(User);
const deleteUser = deleteOne(User);

// get Current User
const getMe = async (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

// To deactivate A user account
const deactivateUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user._id, { active: false });
  res.status(204).json({
    status: "success",
  });
});

// Check if someone try to change password or changedPassword without authentication
const passwordCheck = catchAsync(async (req, res, next) => {
  if (
    req.body.password ||
    req.body.confirmPassword ||
    req.body.passwordChangeAt
  ) {
    return next(
      new AppError(
        "To update password or email use /users/update-password/ or /users/update-email/ route",
        404
      )
    );
  }
  if (req.body.role) {
    return next(new AppError("Only admin can update user role", 404));
  }

  next();
});

const updateEmail = catchAsync(async (req, res, next) => {
  req.body = req.body.email;
  next();
});

module.exports = {
  getAllUser,
  updateUserDetails,
  deactivateUser,
  deleteUser,
  getUser,
  passwordCheck,
  getMe,
  updateEmail,
};
