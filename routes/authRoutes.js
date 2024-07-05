require('dotenv').config();
const express = require("express");
const { loginController, SignupController, otpController, verifyOtpController, NewPasswordController, UserSignupController, UserloginController, UserOtpController, UserverifyOtpController, UserNewPasswordController  } = require("../controllers/authController");
const passport = require("passport");
const axios = require("axios");
const UserData = require("../models/userModel");
const VendorData = require("../models/vendor/vendorModel")// vendor data for registration of restaurent manager

const jwt = require("jsonwebtoken");
// const jwtAuth = require("../middlewares/jwtAuth");

const router = express.Router();

// Register Route
router.route("/signup").post(UserSignupController);
// vendor register rout
router.route("/Vendorsignup").post(SignupController);


// login Route
router.route("/login").post(UserloginController);
// vendor login
router.route("/Vendorlogin").post(loginController);

// opt route for mail
router.route("/sendotp").post(UserOtpController);
// vendor send otp
router.route("/Vendorsendotp").post(otpController);

// otp verify
router.route("/otpverify").post(UserverifyOtpController);
//Vendor otp verify
router.route("/Vendorotpverify").post(verifyOtpController);

// set new password
router.route("/newpassword").post(UserNewPasswordController);
// vendor set new password
router.route("/Vendornewpassword").post(NewPasswordController);

// forward to google
router.get('/google', passport.authenticate("google", {
    scope: ['profile', 'email']
  }));

// google authentication
router.route("/google/callback").get(passport.authenticate("google", {
    successRedirect: "http://localhost:3000",
    failureRedirect:"http://localhost:3000/login"
}));





// forwarding request to google auth
// router.get("/google", async (req, res) => {
//     // console.log("hello")
//     try {
//         const response = await axios.get("https://accounts.google.com/o/oauth2/v2/auth", {
//             params: req.query
//         })
//         console.log(response);
//         // res.send(response)
//     } catch (error) {
//         console.log(error)
//     }
// });

// // register or signi user to db
router.get("/login/success", async (req, res) => {
    if (req.user) {
        // console.log(req.user)
        const userExists = await UserData.findOne({ email: req.user._json.email });
        // console.log(userExists)
        if (userExists) {
            const token = jwt.sign({ _id: userExists._id }, process.env.JWT_SECRET_KEY, { expiresIn: '2d' });
            // console.log(token)
            res.status(200).send({success:true, message: "User Logged in", user: req.user, token })
        } else {
            const newUser = new UserData({
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


router.get("/login/failed", (req, res) => {
    res.status(401).send({ message: "Login failed" });
})

router.get("/logout", (req, res) => {
    req.logOut(err => {
        if (err) {
            console.log(err)
        }
        res.redirect("/login");
    })
})


    
    


module.exports = router;