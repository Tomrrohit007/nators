const express = require('express');
const {protectRoute, restrictTo} = require("../controllers/authControllers")
const {createTour, getAllTours, getTour, deleteTour, updateTour, deleteAllTours, tourStats, getMonthlyPlan} = require("../controllers/tourController")
const Review = require("../routes/reviewRoute")

const router = express.Router();
// MERGE ROUTES
router.use("/:tourId/reviews", Review)

// Aggregated Routes 
router.route("/monthly-plan/:year").get(getMonthlyPlan)
router.route("/tour-stats").get(tourStats)

// Routes without ID
router.route('/').get(protectRoute, getAllTours).post(createTour).delete(deleteAllTours);

// Routes with ID
router.route('/:id').get(getTour).delete(protectRoute, restrictTo("admin", "lead-guide"), deleteTour).patch(protectRoute, restrictTo("admin", "lead-guide"),updateTour);

//Tour/Review
module.exports = router