const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");
const User = require("../model/userModel");
const catchAsync = require("../utils/catchError");

// JWT TOKEN
const jwtToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

// SIGN UP
const signup = catchAsync(async (req, res, next) => {
  const { name, password, email, confirmPassword } = req.body;
  const newUser = await User.create({
    name,
    password,
    email,
    confirmPassword,
  });

  const token = jwtToken(newUser._id);

  res.status(200).json({
    status: "success",
    token,
    data: newUser,
  });
});

// LOGIN 
const login = catchAsync(async (req, res, next) => {
  const { password, email } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }
  const token = jwtToken(user._id);
  return res.status(200).json({
    status: "success",
    token,
  });
});


const protectRoute = catchAsync(async(req, res, next)=>{
  const {authorization} = req.headers
  let token;
  if(authorization && authorization.startsWith("Bearer")){
    token = authorization.split(" ")[1]
  }
  console.log(token)
  next()
})

module.exports = { signup, login, protectRoute };
