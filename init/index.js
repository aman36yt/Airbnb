const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initData = require("./data.js");

let MONGOOSE_URL = 'mongodb://127.0.0.1:27017/Nuvora';
async function main(){
    await mongoose.connect(MONGOOSE_URL);
}main().then(()=>{console.log("DataBase Connected Succesfully!");
}).catch((err)=>{console.log(err);
});

const initDB = async ()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({
        ...obj,
        owner:'6a99ab3f6c4062bd24d3f03f',
    }));
    await Listing.insertMany(initData.data);
    console.log("data was saved");
}
initDB();