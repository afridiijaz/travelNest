const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {reviewSchema} = require("../schema.js")
const Listing = require("../models/listing.js"); // listing schema defined 
const Review = require("../models/review.js");
const {validateReview, isLoggedIn} = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");

// Review post Route
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));

// Delete review route
router.delete("/:reviewId",isLoggedIn,wrapAsync(reviewController.destroyReveiw));


module.exports = router;