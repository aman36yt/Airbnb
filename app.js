const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);

const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
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
app.get("/listings",async (req,res)=>{
   let allListings =await Listing.find();
    res.render("./listings/index.ejs",{allListings});
});

//NEW Route
app.get("/listings/new",(req,res)=>{
    res.render("./listings/form.ejs");
});

//Show Route--Read
app.get("/listings/:id",async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("./listings/show.ejs",{listing});
});

//create Route
app.post("/listings",async (req,res)=>{
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
});

//Edit route
app.get("/listings/:id/edit",async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("./listings/edit.ejs",{listing});
});

//Update route
app.put("/listings/:id",async (req,res)=>{
    let {id} = req.params;
    // let listing = req.body.listing;
    // let updatedList = await Listing.findByIdAndUpdate(id,listing);
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
});

//Delete Route
app.delete("/listings/:id",async(req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
});

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

app.listen(8080,()=>{
    console.log("Listening to port 8080!");
});