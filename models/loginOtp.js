const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true
    }
});
const OtpData = mongoose.model("OtpData", otpSchema);

module.exports = OtpData;