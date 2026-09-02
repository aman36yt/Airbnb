const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {isLoggedin} = require("../middleware.js");

const Listing = require("../models/listing.js");
const {listingSchema} = require("../schema.js");

const validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error);
    }else{
        next();
    }
};


//index route
router.get("/",wrapAsync(async (req,res)=>{
   let allListings =await Listing.find();
    res.render("./listings/index.ejs",{allListings});
}));

//NEW Route
router.get("/new",isLoggedin,(req,res)=>{
    // console.log(req.user);
    res.render("./listings/form.ejs");
});

//Show Route--Read
router.get("/:id",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error","Listing you requested for does not Exist");
        return res.redirect("/listings");
    }
    res.render("./listings/show.ejs",{listing});
}));



//create Route
router.post("/",isLoggedin,validateListing,wrapAsync(async (req,res)=>{    
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success","New listing Created!");
    res.redirect("/listings");
}));

//Edit route
router.get("/:id/edit",isLoggedin,wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not Exist");
        return res.redirect("/listings");
    }
    res.render("./listings/edit.ejs",{listing});
}));

//Update route
router.put("/:id",isLoggedin,validateListing,wrapAsync(async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("update","Updated successfully!");
    res.redirect(`/listings/${id}`);
}));

//Delete Route
router.delete("/:id",isLoggedin,wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("delete","One Listing Removed!");
    res.redirect("/listings");
}));




module.exports=router;