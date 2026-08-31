const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);

const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const {listingSchema} = require("./schema.js");
const Review = require("./models/review.js");
const {reviewSchema} = require("./schema.js");
const { get } = require("http");
let MONGOOSE_URL = 'mongodb://127.0.0.1:27017/Nuvora';
async function main(){
    await mongoose.connect(MONGOOSE_URL);
}main().then(()=>{console.log("DataBase Connected Succesfully!");
}).catch((err)=>{console.log(err);
});


app.get("/",(req,res)=>{
    res.send("HI,THis is Root!");
});

//index route
app.get("/listings",wrapAsync(async (req,res)=>{
   let allListings =await Listing.find();
    res.render("./listings/index.ejs",{allListings});
}));

//NEW Route
app.get("/listings/new",(req,res)=>{
    res.render("./listings/form.ejs");
});

//Show Route--Read
app.get("/listings/:id",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id).populate("reviews");
    res.render("./listings/show.ejs",{listing});
}));

const validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error);
    }else{
        next();
    }
};
const validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error);
    }else{
        next();
    }
};

//create Route
app.post("/listings",validateListing,wrapAsync(async (req,res)=>{
    // let result = listingSchema.validate(req.body);
    // // console.log(result);
    // if(result.error){
    //     throw new ExpressError(400,result.error);
    // }
    // if(!req.body.listing){
    //     throw new ExpressError(400,"Send valid Data for listing");
    // }    
    const newListing = new Listing(req.body.listing);
    // if(!newListing.title){throw new ExpressError(400,"NOT VALID A TITLE")}
    // if(!newListing.description){throw new ExpressError(400,"NOT A VALID Description")}
    // if(!newListing.price){throw new ExpressError(400,"NOT VALID A Price")}
    // if(!newListing.location){throw new ExpressError(400,"NOT VALID A Location")}
    // if(!newListing.country){throw new ExpressError(400,"NOT VALID A COUNTRY")}
    await newListing.save();
    res.redirect("/listings");
}));

//Edit route
app.get("/listings/:id/edit",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("./listings/edit.ejs",{listing});
}));

//Update route
app.put("/listings/:id",validateListing,wrapAsync(async (req,res)=>{
    // let result = listingSchema.validate(req.body);
    // if(result.error){
    //     throw new ExpressError(400,result.error);
    // }
    // if(!req.body.listing){
    //     throw new ExpressError(400,"Send valid Data for listing");
    // } 
    let {id} = req.params;
    // let listing = req.body.listing;
    // let updatedList = await Listing.findByIdAndUpdate(id,listing);
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

//Delete Route
app.delete("/listings/:id",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

//reviews route
app.post("/listings/:id/reviews",validateReview,wrapAsync(async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    // console.log("New Review Saved!");
    res.redirect(`/listings/${listing._id}`);
}));

//delete review route
app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async(req,res)=>{
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}));


// app.get("/testListing",async (req,res)=>{
//     let sampleListing = new Listing({
//         title:"My New villa",
//         description:"By the Beach",
//         price:1200,
//         location:"Calangute Goa",
//         country:"India"
//     })
//     await sampleListing.save();
//     console.log("Sample was Saved");
//     res.send("Successful Testing!!");
// });

// const handleValidation = (err)=>{
//     console.log("THIS IS VALIDATION ERROR!");
//     console.log("-->",err.message);
//     return err;
// }

// app.use((err,req,res,next)=>{
//     console.log(err.name);
//     if(err.name==="ValidationError"){
//         err = new ExpressError(404,"NOT VALID DATA")
//     }
//     next(err);
// });



// Place this AFTER all your valid routes
app.all("/{*splat}", (req, res, next) => {
    next(new ExpressError(404, "PAGE NOT FOUND!"));
});

// Place your final error handler handler AFTER the 404 block
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs",{statusCode,message});
});

app.listen(8080,()=>{
    console.log("Listening to port http://localhost:8080/");
});