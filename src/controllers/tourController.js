const Tour = require("../model/tourModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchError");
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require("./handlerFactory");

const getAllTours = getAll(Tour);
const getTour = getOne(Tour, { path: "reviews" });
const createTour = createOne(Tour);
const updateTour = updateOne(Tour);
const deleteTour = deleteOne(Tour);

// 7) TOUR STATS
const tourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
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
  const plan = await Tour.aggregate([
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

// To find out tour within a certain radius
const getGeolocationWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(",");

  if (!lat || !lng) {
    return next(
      new AppError(
        "Please provide latitude and longitude in the format of lat,lng",
        400
      )
    );
  }

  const radius = unit === "mi" ? distance / 3958.8 : distance / 6378.1;

  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    status: "success",
    count: tours.length,
    data: tours,
  });
});

// To find out tour the distance between a point and tours
const getDistancesOfTour = catchAsync(async (req, res, next) => {
  const { unit, latlng } = req.params;
  const [lat, lng] = latlng.split(",");

  const multiplier = unit === "mi" ? 0.000621371 : 0.001;
  if (!lat || !lng) {
    return next(
      new AppError(
        "Please provide latitude and longitude in the format of lat,lng",
        400
      )
    );
  }

  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [lng * 1, lat * 1],
        },
        distanceField: "distance",
        distanceMultiplier: multiplier,
      },
    },
    { $project: { distance: 1, name: 1 } },
  ]);

  res.status(200).json({
    status:"success",
    count:distances.length,
    data:distances
  })
});

module.exports = {
  createTour,
  getAllTours,
  getTour,
  deleteTour,
  updateTour,
  tourStats,
  getMonthlyPlan,
  getDistancesOfTour,
  getGeolocationWithin,
};
