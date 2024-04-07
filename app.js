//It means whenever we are uploading this project/file to any platform then never upload .env file.
if(process.env.NODE_ENV != "production"){
require('dotenv').config();
}
// console.log(process.env.variable_name); // we can use this to print/access environment variables.


//Express
const express = require("express");
const app = express();

//Mongoose
const mongoose = require("mongoose");
// const Listing = require("./models/listing.js");
// const Review=require("./models/review.js");

//Path
const path = require("path");

//Requirirng Passport
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");

//EJS Set-up
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware for parsing URL encoding form data
app.use(express.urlencoded({ extended: true }));

//Middleware for parsing JSON in the request body
app.use(express.json());

//Middleware for Serving static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

//Method-Override : NPM Package
const methodOverride = require("method-override");
app.use(methodOverride("_method"));

//EJS-Mate
const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate);

// //Requiring wrapAsync
// const wrapAsync = require("./utils/wrapAsync.js");

//Requiring ExpressError
const ExpressError = require("./utils/ExpressError.js");


// //Requiring Joi
// const { listingSchema , reviewSchema } = require("./schema.js");


//Requiring Sessions
const sessions = require("express-session");
const session = require("express-session");

//Requiring Connect-mongo
const MongoStore=require('connect-mongo');
const dbUrl=process.env.ATLASDB_URL;

const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter: 24*3600
});

store.on("error",()=>{
    console.log("Error in Mongo Session Store",err);
})

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true   //Used for security purpose , i.e to prevent from cross scripting attacks.
    },
};

app.use(session(sessionOptions));


//Requiring Flash
const flash = require("connect-flash");
app.use(flash());  // Use it before Requiring Routes

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());   //Generates a function that is used by Passport to serialize users into the session.
passport.deserializeUser(User.deserializeUser());  //Generates a function that is used by Passport to deserialize user into the session.


app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser=req.user;  //Since req.user can't be accessed directly inside the navbar.ejs but local variables can be accessed so we are storing the req.user in local variable and then accessing.
    // console.log(res.locals.success);
    next();
});


app.get("/demouser", async (req, res) => {
    let fakeUser = new User({
        email: "student@gmail.com",
        username: "delta-student"
    });
    let registeredUser = await User.register(fakeUser, "helloworld");   //This is a static method.
    res.send(registeredUser);
});



//Requiring Routes
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");


//Listening Incoming Requests
const port = 8080;
app.listen(port, () => {
    console.log(`Server is listening to port ${port}`);
});


//For express Router
app.use("/listings", listingRouter);  //For "/listings" , use listing file
app.use("/listings/:id/reviews", reviewRouter);
app.use("/",userRouter);

//To verify Connection : 
//Start server : npx nodemon app.js and send request : localhost:8080
// app.get("/", (req, res) => {
//     res.send("Hi , I am root");
// });


//Establishing connection with Mongoose.
// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

// const dbUrl=process.env.ATLASDB_URL;

main()
    .then(() => {
        console.log("Connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

// async function main() {
//     await mongoose.connect(MONGO_URL);
// }

async function main() {
    await mongoose.connect(dbUrl);
}


// Below is an example, to show how to add Data to Database
// app.get("/testListing", async (req, res) => {
//     let sampleListing = new Listing({
//         title: "My New Villa",
//         description: "By the beach",
//         price: 1200,
//         location: "Calangute, Goa",
//         country: "India",
//     });
//     await sampleListing.save();
//     console.log("Sample was Saved");
//     res.send("Successful Testing");
// });
//Refer to index.js where we have added data in Bulk to Database.



//Suppose we want to send a page not found Error if no request is matched
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
})

//Error Handling Middleware 
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).render("error.ejs", { err });
    // res.status(statusCode).send(message);
    // res.send("Something went wrong");
});