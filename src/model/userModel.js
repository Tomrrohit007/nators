const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const validator = require("validator");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name is required"],
    maxLength: [50, "name should be upto 50 characters"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "email is required"],
    unique: [true, "email should be unique"],
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  image: {
    type: String,
  },
  password: {
    type: String,
    required: [true, "A password is required"],
    minLenght: [8, "A password must have minimum length of 8 characters"],
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, "A password is required"],
    minLenght: [8, "A password must have minimum length of 8 characters"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      messsage: "Passwords doesn't match",
    },
  },
});

userSchema.pre("save", async function (next) {
  // Checking if password is being modified
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

module.exports = mongoose.model("users", userSchema);
