const express = require('express');
const router = express.Router();
const {protectRoute} = require("../controllers/authControllers")
const {createTour, getAllTours, getTour, deleteTour, updateTour, deleteAllTours, tourStats, getMonthlyPlan} = require("../controllers/tourController")

// Aggregated Routes 
router.route("/monthly-plan/:year").get(getMonthlyPlan)
router.route("/tour-stats").get(tourStats)

// Routes without ID
router.route('/').get(protectRoute, getAllTours).post(createTour).delete(deleteAllTours);

// Routes with ID
router.route('/:id').get(getTour).delete(deleteTour).patch(updateTour);

module.exports = router