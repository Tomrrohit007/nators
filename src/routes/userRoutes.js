const express = require("express")
const router = express.Router()

const {signup, login, resetPassword, forgotPassword, protectRoute, restrictTo, updatePassword} = require("../controllers/authControllers")
const {getAllUser, updateUserDetails, deleteUser} = require("../controllers/userController")

router.post("/forget-password", forgotPassword)
router.patch("/reset-password/:token", resetPassword)
router.post("/signup", signup)
router.post("/login", login)
router.patch("/update-password", protectRoute, updatePassword)

router.route("/").get(protectRoute, restrictTo("admin"), getAllUser).patch(protectRoute, updateUserDetails).delete(protectRoute, deleteUser)





module.exports = router