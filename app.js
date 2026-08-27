const express = require("express");
const app = express();
const path = require("path");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));


const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
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