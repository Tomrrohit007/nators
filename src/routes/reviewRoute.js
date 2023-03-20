const express = require("express");
const {
  protectRoute,
  restrictUser,
} = require("../controllers/authControllers");
const {
  getReview,
  createReview,
  deleteReview,
  updateReview,
  setUserAndTour,
} = require("../controllers/reviewsController");

const router = express.Router({ mergeParams: true });
router.route("/").get(getReview).post(protectRoute, setUserAndTour, createReview);
router.use(protectRoute);
router.route("/:id").delete(restrictUser, deleteReview).patch(restrictUser, updateReview);

module.exports = router;
