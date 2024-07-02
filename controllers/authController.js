const UserData = require("../models/userModel");
const OtpData = require("../models/loginOtp");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const generateOtp = require("../utils/generateOtp");
const axios = require("axios");
const passport = require("passport");


///// Signup controller
exports.SignupController = async (req, res) => { 
    try {
        // console.log(req.body)
        const { firstName, lastName, email, phoneNumber, password } = req.body;
        const isExist = await UserData.findOne({ email: email })
        if (!isExist) {
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new UserData({ firstName, lastName, email, phoneNumber, password:hashedPassword });
            user.save();
            return res.status(201).send({ success: true, message: "User Registered Successfully"});
        }
        else {
            return res.status(200).send({ success: false, message: "User Already Registered, Please Login" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ success: false, message: "Internal Server Error" });
    }
};

// Login Controller
exports.loginController = async (req, res) => {
    try {
        // console.log(req.body)
        const { email, password } = req.body;
        // validation
        // if (!email || !password) {
        //     return res.status(404).send({ success: false, message: "Invalid Email or Password" });
        // }
        // get user from db
        const user = await UserData.findOne({ email: email });
        // console.log(user)
        // check user
        if (!user) {
            return res.status(404).send({ success: false, message: "User Not Found" });
        }
        // compare password
        const passwordCheck = await bcrypt.compare(password, user.password);
        if (!passwordCheck) {
            console.log("true")
            return res.status(400).send({ success: false, message: "Incorrect Password" });
        }
        // creating token
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '2d' });
        return res.status(200).send({
          success: true,
          message: "Login Success",
          token,
          adminCheck:user.admin,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).send({ success: false, message: "Internal Server Error" });
    }

};

// mail otp
exports.otpController = async (req, res) => {
    const { email } = req.body;
    // console.log(email);
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "karthikreddy7877@gmail.com",
        pass: "fbrqwbdatrtkcwpw",
      },
    });
  
    try {
      
      const user = await UserData.findOne({ email });
      if (user) {
        // console.log("user found");
        const otp = generateOtp();
        // console.log(otp);
        const existEmail = await OtpData.findOne({ email: email });
        if (existEmail) {
          const updateData = await OtpData.findByIdAndUpdate({ _id: existEmail._id }, {
            otp: otp
          });
          await updateData.save();
          const options = {
            from: "karthikreddy7877@gmail.com",
            to: email,
            subject: "otp for login",
            text: `otp : ${otp} `,
          };
          await transporter.sendMail(options);
          return res
            .status(200)
            .send({ success: true, message: "OTP sent to your mail" });
        }
        else {
          const saveOtpData = new OtpData({
            email: email,
            otp: otp
          });
          await saveOtpData.save();
          const options = {
            from: "karthikreddy7877@gmail.com",
            to: email,
            subject: "OTP for login from FINDDubai",
            text: `OTP : ${ otp } `,
          };
          await transporter.sendMail(options);
          return res
            .status(200)
            .send({ success: true, message: "OTP sent to your mail" });
        }
      } else {
        // console.log("not found");
        return res.status(400).send({ success: false, message: "User Not Registered" });
      }
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send({ success: false, message: "Internal server Error" });
    }
};
  
// otp verify and login controller
exports.verifyOtpController = async (req, res) => { 
    try {
      // console.log(req.body)
      const { email, otp } = req.body;
      const user = await OtpData.findOne({ email });
      // console.log(user)
      if (user.otp === otp) {
        let payload = {
          id: user._id
        };
        let token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "1hr" });
        return res.status(200).send({success:true, message:"Login Success", token:token})
      }
      else {
        return res.status(400).send({success:false, message:"Wrong Otp"})
      }
    } catch (error) {
      console.log(error)
    }
};
  
// set new password
exports.NewPasswordController = async (req, res) => {
    try {
        // console.log(req.body)
        const { email, password } = req.body;

        const user = await UserData.findOne({ email: email });
        console.log(user)
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const result = await UserData.findByIdAndUpdate({ _id: user._id }, {
            password:hashedPassword
        })
        console.log(result)
        return res
            .status(200)
            .send({ success: true, message: "password updated successfully" });

    } catch (error) {
        console.log(error);
        return res.status(500).send({ success: false, message: "Internal Server Error" });
    }

};