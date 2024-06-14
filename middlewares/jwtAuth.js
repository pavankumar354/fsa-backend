const jwt = require("jsonwebtoken");
const UserData = require("../models/userModel");

const jwtAuth = async (req, res, next) => { 
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).send({ message: "Token not provided" });
    }

    const jwtToken = token.replace("Bearer", "").trim();
    // console.log(jwtToken)
    try {
        const isVerified = jwt.verify(jwtToken, process.env.JWT_SECRET_KEY)
        // console.log(isVerified)
        const user = await UserData.findOne({ _id: isVerified.id }).select({password:0})
        // console.log(user)
        req.user = user;
        req.token = token;
        req.id = user._id;
        next();
    } catch (error) {
        return res.status(401).send({ message: "Invalid Jwt token provided" });
    }
};

module.exports = jwtAuth;