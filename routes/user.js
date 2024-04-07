const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require('passport');
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controllers/users.js");
const user = require("../models/user.js");


router.route("/signup")
    .get(userController.renderSignUpForm)
    .post(wrapAsync(userController.signup));

router.route("/login")
    .get(userController.renderLoginForm)
    .post(
        saveRedirectUrl,
        passport.authenticate("local", {
            failureRedirect: "/login",
            failureFlash: true
        }), userController.login);

// router.get("/signup", userController.renderSignUpForm);


// router.post("/signup", wrapAsync(userController.signup));


// router.get("/login", userController.renderLoginForm);


// //passport.authenticate -> this is a middleware and it will automatically verify the user in the database
// router.post("/login",
//     saveRedirectUrl,
//     passport.authenticate("local", {
//         failureRedirect: "/login",
//         failureFlash: true
//     }),
//     async (req, res) => {
//         req.flash("success", "Welcome to AirBnb!");
//         // res.redirect(req.session.redirectURL);
//         //We are using "req.session.redirectURL" saved in the middleware but due to passport a problem will occur here that is passport will reset the "req.session.redirectURL" after returning success from passport.authenticate and the "redirectUrl" will be lost.
//         //So we will save the "redirectURL" in locals and passport do not have the permission to delete the locals.
//         //So for this purpose we will create the middleware in middleware.js

//         let redirectUrl = res.locals.redirectUrl || "/listings";
//         res.redirect(redirectUrl);
//     });



//passport.authenticate -> this is a middleware and it will automatically verify the user in the database
// router.post("/login",
//     saveRedirectUrl,
//     passport.authenticate("local", {
//         failureRedirect: "/login",
//         failureFlash: true
//     }),userController.login);


//Logout functionality
router.get("/logout", userController.logout);


module.exports = router;

