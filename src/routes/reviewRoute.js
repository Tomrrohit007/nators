const express = require("express")
const { protectRoute} = require("../controllers/authControllers")
const {getReview, createReview} = require("../controllers/reviewsController")

const router = express.Router({mergeParams:true})

router.route("/").get(protectRoute, getReview).post(protectRoute, createReview)


module.exports = router 

