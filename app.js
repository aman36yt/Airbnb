const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

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
const sessionOptions = {
    secret:"mysecretcodestring",
    resave: false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge:7 * 24 * 60 * 60 * 1000,
        httpOnly:true,
    }
};

app.get("/",(req,res)=>{
    res.send("HI,THis is Root!");
});

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.successMsg  = req.flash("success");
    res.locals.deleteMsg = req.flash("delete");
    res.locals.updateMsg = req.flash("update");
    res.locals.errorMsg = req.flash("error");
    res.locals.currUser = req.user;
    next(); 
});

// app.get("/demouser",async(req,res)=>{
//     let demoUser = new User({
//         email:"demon@gmail",
//         username:"Iamdemo"
//     });
//     let regUser = await User.register(demoUser,"helloworld");
//     res.send(regUser);
// });



const listingRouter = require("./routes/listing.js");
app.use("/listings",listingRouter);

const reviewRouter = require("./routes/review.js");
app.use("/listings/:id/reviews",reviewRouter);

const userRouter = require("./routes/user.js");
app.use("/",userRouter);

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