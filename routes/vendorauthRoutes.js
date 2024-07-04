const express = require("express");
const { SignupController, otpController, verifyOtpController, NewPasswordController, userDocumentController  } = require("../controllers/authController");
const { loginController } = require("../controllers/authController");
const passport = require("passport");
const axios = require("axios");
const UserData = require("../models/userModel");
const VendorData = require("../models/vendor/vendorModel")// vendor data for registration of restaurent manager
const userDocument = require("../models/user/userDocument")
require('dotenv').config();
const jwt = require("jsonwebtoken");
// const jwtAuth = require("../middlewares/jwtAuth");

const VendorRouter = express.Router();

// Register Route
// router.route("/signup").post(SignupController);
// vendor register rout
VendorRouter.route("/Vendorsignup").post(SignupController);


// login Route
// router.route("/login").post(loginController);
// vendor login
VendorRouter.route("/Vendorlogin").post(loginController);

// opt route for mail
// router.route("/sendotp").post(otpController);
// vendor send otp
VendorRouter.route("/Vendorsendotp").post(otpController);

// otp verify
// router.route("/otpverify").post(verifyOtpController);
//Vendor otp verify
VendorRouter.route("/Vendorotpverify").post(verifyOtpController);

// set new password
// router.route("/newpassword").post(NewPasswordController);
// vendor set new password
VendorRouter.route("/Vendornewpassword").post(NewPasswordController);



// user documentation controller

// VendorRouter.route("/CreateUsers").post(userDocumentController);

// forward to google
// router.get('/google', passport.authenticate("google", {
//     scope: ['profile', 'email']
//   }));

// google authentication
VendorRouter.route("/google/callback").get(passport.authenticate("google", {
    successRedirect: "http://localhost:3000",
    failureRedirect:"http://localhost:3000/login"
}));





// forwarding request to google auth
VendorRouter.get("/google", async (req, res) => {
    // console.log("hello")
    try {
        const response = await axios.get("https://accounts.google.com/o/oauth2/v2/auth", {
            params: req.query
        })
        console.log(response);
        // res.send(response)
    } catch (error) {
        console.log(error)
    }
});

// // register or signi user to db
VendorRouter.get("/login/success", async (req, res) => {
    if (req.user) {
        // console.log(req.user)
        const userExists = await VendorData.findOne({ email: req.user._json.email });
        // console.log(userExists)
        if (userExists) {
            const token = jwt.sign({ _id: userExists._id }, process.env.JWT_SECRET_KEY, { expiresIn: '2d' });
            // console.log(token)
            res.status(200).send({success:true, message: "User Logged in", user: req.user, token })
        } else {
            const newUser = new VendorData({
                email: req.user._json.email,
                password: Date.now(),
                firstName: req.user._json.given_name,
                lastName: req.user._json.family_name
            });
            await newUser.save();
            res.status(200).send({success:true, message: "User Registered Successfully", user: req.user })
        }
    } else {
        res.status(400).send({success:false, message: "user not Authorized" });
    }
});


VendorRouter.get("/login/failed", (req, res) => {
    res.status(401).send({ message: "Login failed" });
})

VendorRouter.get("/logout", (req, res) => {
    req.logOut(err => {
        if (err) {
            console.log(err)
        }
        res.redirect("/login");
    })
})



module.exports = VendorRouter;