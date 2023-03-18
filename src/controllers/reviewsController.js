const Review = require("../model/reviewModel")
const catchAsync = require("../utils/catchError")

const getReview = catchAsync(async (req, res, next)=>{
    let filter = {user:{_id:req.user.id}}
    if(req.params.tourId) filter = {tour:req.params.tourId} 
    const reviews = await Review.find(filter).select("-__v")

  return res.status(200).json({ count: reviews.length, reviews });
})

const createReview = catchAsync(async (req, res, next) => {
    req.body.user = req.user.id
    req.body.tour = req.params.tourId

    const newReview = await Review.create(req.body);
    return res
      .status(201)
      .json({ message: "Created Successfully", data: newReview });
}) 


module.exports = {getReview, createReview}