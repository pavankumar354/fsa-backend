const otpGenerator = require("otp-generator");


const generateOtp = () => {
    // const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    return otp;
}

module.exports = generateOtp;