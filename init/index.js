const mongoose = require("mongoose");
const initData = require("./data.js"); //Data file
const Listing = require("../models/listing.js");  //Schema is defined here.
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main()
    .then(() => {
        console.log("Connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(MONGO_URL, { useNewUrlParser: true });
}

const initDB = async () => {
    await Listing.deleteMany({}); //Clearing the Database first and then adding new Data.
    initData.data=initData.data.map((obj)=>({...obj,owner:"660db654e753763d4cb3fb1a"}));
    await Listing.insertMany(initData.data);
    console.log("Data was Initialized");
};
initDB();
