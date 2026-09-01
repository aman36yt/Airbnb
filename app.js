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

const users = require("./routes/listing.js");
app.use("/listings",users);

const reviews = require("./routes/review.js");
app.use("/listings/:id/reviews",reviews);



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