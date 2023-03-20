const Review = require("../model/reviewModel");
const { deleteOne, updateOne, createOne, getAll } = require("./handlerFactory");

const setUserAndTour = (req, res, next) => {
  req.body.user = req.user.id;
  req.body.tour = req.params.tourId;
  next();
};

// Get reviews for current User/Tour
const getReview = getAll(Review);
const createReview = createOne(Review);
const deleteReview = deleteOne(Review);
const updateReview = updateOne(Review);

module.exports = {
  getReview,
  createReview,
  deleteReview,
  updateReview,
  setUserAndTour,
};
