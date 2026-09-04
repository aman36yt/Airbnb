const express = require("express");
const router = express.Router({mergeParams:true});

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");

const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const {validateReview, isLoggedin, isReviewAuthor} = require("../middleware.js");

const reviewsController = require("../controllers/reviews.js");

//reviews route
router.post("/",isLoggedin,validateReview,wrapAsync(reviewsController.createReviews));

//delete review route
router.delete("/:reviewId",isLoggedin,
    isReviewAuthor,
    wrapAsync(reviewsController.destroyReview)
);



module.exports=router;