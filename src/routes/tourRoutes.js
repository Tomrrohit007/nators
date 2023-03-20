const express = require("express");
const { protectRoute, restrictTo } = require("../controllers/authControllers");
const {
  createTour,
  getAllTours,
  getTour,
  deleteTour,
  updateTour,
  tourStats,
  getMonthlyPlan,
  getDistancesOfTour,
  getGeolocationWithin,
} = require("../controllers/tourController");
const Review = require("../routes/reviewRoute");

const router = express.Router();
// MERGE ROUTES
router.use("/:tourId/reviews", Review);

// Aggregated Routes
router.route("/tour-stats").get(tourStats);
router
  .route("/monthly-plan/:year")
  .get(
    protectRoute,
    restrictTo("admin", "lead-guide", "guide"),
    getMonthlyPlan
  );

// Geolocations
router
  .route("/geolocation-within/:distance/center/:latlng/unit/:unit")
  .get(getGeolocationWithin);
router.route("/distances/center/:latlng/unit/:unit").get(getDistancesOfTour)

// Routes without ID
router
  .route("/")
  .get(getAllTours)
  .post(protectRoute, restrictTo("admin"), createTour);
// Routes with ID
router
  .route("/:id")
  .get(getTour)
  .delete(protectRoute, restrictTo("admin"), deleteTour)
  .patch(protectRoute, restrictTo("admin"), updateTour);

//Tour/Review
module.exports = router;
