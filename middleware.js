const Listing = require("./models/listing");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");

module.exports.isLoggedIn = (req, res, next) => {
    // console.log(req.user);   // To print the user info stored in express session.
    // console.log(req);   //To print the req object

    // console.log(req.path+"  ........  "+req.originalUrl);
    //req.path -> is the path we are trying to access
    //req.originalUrl -> is the path orginal path


    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;   //It means we are creating a variable(or parameter) inside session named redirectUrl and remember that req, session both are objects.
        req.flash("error", "You must be loged in");
        return res.redirect("/login");
    }
    next();
}


module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}


module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the owner of listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}



//Now Implementing the Validation for the Schema in the form of Middleware
module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, error);
    } else {
        next();
    }
}



//Now Implementing the Validation for the reviewSchema in the form of Middleware
module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, error);
    } else {
        next();
    }
}


//Only owner of reviews can delete the reviews
module.exports.isReviewAuthor = async (req, res, next) => {
    let { id,reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the owner of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}