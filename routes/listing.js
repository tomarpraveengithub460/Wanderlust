const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

const listingController = require("../controllers/listings.js");

const {storage}=require("../cloudconfig.js");

const multer=require("multer");
const upload=multer({storage});

//Using Router.route
router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn,upload.single('listing[image]'),validateListing, wrapAsync(listingController.createListing));



//New Route : Now placed before the "/:id" else new will be considered as id.  
router.get("/new", isLoggedIn, listingController.renderNewForm);



router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn, isOwner,upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));



//Index Route  
// router.get("/", wrapAsync(listingController.index));

//New Route is placed before Show Route.
//If placed after Show then  when we will send the GET Request to "/listings/new" then SHOW Route will accept "new" as id.

//New Route
// router.get("/new", isLoggedIn, (req, res) => {
//     // console.log(req.user);    //gives the information of the user 
//     // if(!req.isAuthenticated()){    //Checking whether user is logged in or not.
//     //     req.flash("error","You must be logged in to Create Listing");
//     //     return res.redirect("/login");
//     // }
//     // res.render("listings/new.ejs");

//     res.render("listings/new.ejs");
// });


// //New Route
// router.get("/new", isLoggedIn, listingController.renderNewForm);



//Show Route
// router.get("/:id", wrapAsync(listingController.showListing));


// //Create Route
// router.post("/", wrapAsync(async (req, res) => {
//     // //Suppose client has send a post request using hoppscotch.io withoutr req body then throw Error.
//     // if (!req.body.listing) {
//     //     throw new ExpressError(400, "Send valid data for listing");
//     // }

//     // //Using Joi
//     // let result=listingSchema.validate(req.body);
//     // console.log(result);
//     // if(result.error){
//     //     throw new ExpressError(400,result.error);
//     // }


//     const newListing = new Listing(req.body.listing);
//     //Why req.body.listing => This is because of name attribute used in input fields , see new.ejs in listings.


//     //Now adding Schema Validation and to test the validation use hoppscotch.io and send post request with partial infomation such that listing[title] : ------  and so on.
//     // if(!newListing.description){
//     //     throw new ExpressError(400,"Description is missing!");
//     // }
//     // if(!newListing.title){
//     //     throw new ExpressError(400,"Title is missing!");
//     // }
//     // if(!newListing.location){
//     //     throw new ExpressError(400,"Location is missing!");
//     // }
//     //Above way of Schema Validation is not a proper way so we avoid this and we use "joi" a npm package.
//     //"joi" is the most powerful schema description language and data validator for javascript.


//     await newListing.save();
//     res.redirect("/listings");
// })
// );


//Create Route using "validateListing" Middleware
//Create Route
// router.post("/", validateListing, wrapAsync(listingController.createListing));



//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

// //Update Route
// router.put("/:id", wrapAsync(async(req, res) => {
//     //Suppose client has send a post request using hoppscotch.io withoutr req body then throw Error.
//     if (!req.body.listing) {
//         throw new ExpressError(400, "Send valid data for listing");
//     }
//     let { id } = req.params;
//     await Listing.findByIdAndUpdate(id, { ...req.body.listing });
//     res.redirect(`/listings/${id}`);
// }));


//Update Route using "validateListing" Middleware
//Update Route
// router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing));

//Delete Route
// router.delete("/:id", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
//     let { id } = req.params;
//     // await Listing.findByIdAndDelete(id);
//     let deletedListing = await Listing.findByIdAndDelete(id);
//     // console.log(deletedListing);
//     req.flash("success", "Listing Deleted !");
//     res.redirect("/listings");
// }));

// router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));


module.exports = router;