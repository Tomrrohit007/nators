const mongoose = require("mongoose");
const Review = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "Review must have a review"],
      minLength: [1, "Review should have some letters"],
    },
    rating: {
      type: Number,
      min: [1, "Rating should have a minimum value of 1"],
      max: [5, "Rating should have a maximum value of 5"],
      required: [true, "Review must have a rating"],
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: "tours",
      required: [true, "Review must belong to a tour"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "users",
      required: [true, "Review must belong to a user"],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

Review.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name photo",
  });
  next();
});

module.exports = mongoose.model("reviews", Review);
