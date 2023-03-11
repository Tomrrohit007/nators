const express = require('express');
const router = express.Router();
const {createTour, getAllTours, getTour, deleteTour, updateTour, deleteAllTours, isTourInvalid, tourStats, getMonthlyPlan} = require("../controllers/tourController")

// Aggregated Routes 
router.route("/monthly-plan/:year").get(getMonthlyPlan)
router.route("/tour-stats").get(tourStats)

// Routes without ID
router.route('/').get(getAllTours).post(createTour).delete(deleteAllTours);

// Routes with ID
router.route('/:id').get(isTourInvalid, getTour).delete(isTourInvalid, deleteTour).patch(isTourInvalid, updateTour);

module.exports = router