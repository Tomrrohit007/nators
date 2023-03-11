const TourModel = require("../model/tourModel");
const mongoose = require("mongoose");
const tourModel = require("../model/tourModel");
const APIFeatures = require("../APIFeature/APIFeature");

// Check if tour exist
const isTourInvalid = (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Tour doesn't exist" });
  }
  next();
};
// CRUD API =>
// GET All
const getAllTours = async (req, res) => {
  const features = new APIFeatures(TourModel.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .pagination();

  try {
    const data = await features.query;

    return res.status(200).json({ count: data.length, data });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

//GET Tour
const getTour = async (req, res) => {
  const { id } = req.params;
  try {
    const tour = await TourModel.findOne({ _id: id });
    res.status(200).json({ tour });
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
};

// Create tour
const createTour = async (req, res) => {
  try {
    const newTour = await TourModel.create({ ...req.body });
    return res.status(201).json({ status: "Created Successfully" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Update Tour
const updateTour = async (req, res) => {
  const { id } = req.params;
  try {
    const tour = await TourModel.findByIdAndUpdate(
      { _id: id },
      { ...req.body }
    );
    res.status(200).json({ message: "Updated Successfuly" });
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
};

// Delete Tour
const deleteTour = async (req, res) => {
  const { id } = req.params;
  try {
    const tour = await TourModel.findOneAndDelete({ _id: id });
    res.status(200).json({ message: "Tour deleted" });
  } catch (error) {
    res.status(404).json({ error: "Tour doesn't exist" });
  }
};

// Non CRUD API =>
// Delete All tour

const deleteAllTours = async () => {
  const tour = await TourModel.deleteMany();
  console.log("deleted Successfully");
};

// Aggregation API

//TOUR STATS
const tourStats = async (req, res) => {
  try {
    const stats = await tourModel.aggregate([
      { $match: { secretTour: { $ne: true } } },
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
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
};

// GET MONTHLY PLANS

const getMonthlyPlan = async (req, res) => {
  const year = req.params.year * 1;
  try {
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

      // Project is used to hide something in data
      {
        $project: { _id: 0 },
      },
      {
        $sort: {
          tourCount: -1,
        },
      },
      // {
      //   $limit:6
      // }
    ]);
    res.status(200).json({
      count: plan.length,
      plan,
    });
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
};

module.exports = {
  createTour,
  getAllTours,
  getTour,
  deleteTour,
  updateTour,
  deleteAllTours,
  isTourInvalid,
  tourStats,
  getMonthlyPlan,
};
