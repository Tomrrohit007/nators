const express = require("express");
const router = express.Router();

const {
  signup,
  login,
  resetPassword,
  forgotPassword,
  protectRoute,
  restrictTo,
  updatePassword,
  passwordBeforeSaving,
} = require("../controllers/authControllers");

const {
  getAllUser,
  updateUserDetails,
  deactivateUser,
  deleteUser,
  getUser,
  getMe,
  passwordCheck,
  updateEmail,
} = require("../controllers/userController");

router.post("/forget-password", forgotPassword);
router.patch("/reset-password/:token", resetPassword);
router.post("/signup", signup);
router.post("/login", login);

router.use(protectRoute);

router.patch("/update-password", passwordBeforeSaving, updatePassword);
router.patch(
  "/update-email",
  getMe,
  passwordBeforeSaving,
  updateEmail,
  updateUserDetails
);
router.patch("/update-details", passwordCheck, getMe, updateUserDetails);
router.delete("/deactivate-account", passwordBeforeSaving, deactivateUser);
router.get("/me", getMe, getUser);

router.use(restrictTo("admin"));

router.route("/").get(getAllUser);
router.route("/:id").delete(deleteUser).get(getUser);

module.exports = router;
