const express = require("express");
const app = express();
const path = require("path");

const mongoose = require("mongoose");
let MONGOOSE_URL = 'mongodb://127.0.0.1:27017/Nuvora';
async function main(){
    await mongoose.connect(MONGOOSE_URL);
}main().then(()=>{console.log("DataBase Connected Succesfully!");
}).catch((err)=>{console.log(err);
});



app.get("/",(req,res)=>{
    res.send("HI,THis is Root!");
});

app.listen(8080,()=>{
    console.log("Listening to port 8080!");
});