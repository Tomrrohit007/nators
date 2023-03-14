const TourModel = require("../model/tourModel");
const mongoose = require("mongoose");

const tourModel = require("../model/tourModel");
const APIFeatures = require("../utils/apiFeature");
const catchAsync = require("../utils/catchError");
const AppError = require("../utils/appError")

// 1) GET All
const getAllTours = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(TourModel.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .pagination();

  const data = await features.query;
  return res.status(200).json({ count: data.length, data });
});

// 2) GET Tour
const getTour = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const tour = await TourModel.findOne({ _id: id });
  if(!tour){
    return next(new AppError(`Tour with id /${id}/ not found`, 404))
  }

  res.status(200).json({ status: "success", tour });
});

// 3) Create tour
const createTour = catchAsync(async (req, res, next) => {
  const newTour = await TourModel.create({ ...req.body });
  return res
    .status(201)
    .json({ message: "Created Successfully", data: newTour });
});

// 4) Update Tour
const updateTour = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const tour = await TourModel.findByIdAndUpdate(
    id,
    { ...req.body },
    {
      new: true,
      runValidators: true,
    }
  );

  if(!tour){
    return next(new AppError(`Tour with id /${id}/ not found`, 404))
  }
  res.status(200).json({ message: "Updated Successfuly" });
});

// 5) Delete Tour
const deleteTour = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const tour = await TourModel.findOneAndDelete({ _id: id });
  if(!tour){
    return next(new AppError(`Tour with id /${id}/ not found`, 404))
  }
  res.status(200).json({ message: "Tour deleted" });
});

// 6) Delete All tour

const deleteAllTours = async () => {
  const tour = await TourModel.deleteMany();
  console.log("deleted Successfully");
};


// 7) TOUR STATS
const tourStats = catchAsync(async (req, res, next) => {
  const stats = await tourModel.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: "$difficulty" },
        tourCount: { $sum: 1 },
        ratingCount: { $sum: "$ratingsQuantity" },
        avgRating: { $avg: "$ratingsAverage" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  res.status(200).json(stats);
});

// 8) GET MONTHLY PLANS

const getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const plan = await TourModel.aggregate([
    // Unwind is used to destructure an array to a whole new object for every item array contains
    {
      $unwind: "$startDates",
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$startDates" },
        tourCount: { $sum: 1 },
        tours: { $push: "$name" },
      },
    },
    {
      $addFields: { month: "$_id" },
    },
    {
      $project: { _id: 0 },
    },
    {
      $sort: {
        tourCount: -1,
      },
    },
  ]);

  res.status(200).json({
    count: plan.length,
    plan,
  });
});


module.exports = {
  createTour,
  getAllTours,
  getTour,
  deleteTour,
  updateTour,
  deleteAllTours,
  tourStats,
  getMonthlyPlan,
};
