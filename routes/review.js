const express = require("express");
const router = express.Router({mergeParams:true});

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");

const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const {validateReview, isLoggedin, isReviewAuthor} = require("../middleware.js");


//reviews route
router.post("/",isLoggedin,validateReview,wrapAsync(async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    newReview.author = req.user._id;
    await newReview.save();
    await listing.save();
    // console.log(newReview);
    req.flash("success","New Reveiew Created!");
    res.redirect(`/listings/${listing._id}`);
}));

//delete review route
router.delete("/:reviewId",isLoggedin,
    isReviewAuthor,wrapAsync(async(req,res)=>{
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("delete","One Review deleted!");
    res.redirect(`/listings/${id}`);
}));



module.exports=router;