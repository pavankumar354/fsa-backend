const UserData = require("../models/userModel");

const getAllUsers = async (req, res) => { 
    try {
        const users = await UserData.find().select({ password: 0 });
        // console.log(users)
        if (!users || users.length === 0) {
            return res.status(400).send({ message: "No Users found" })
        }
        return res.status(200).send({success: true, users});
    } catch (error) {
        console.log(error)
    }
};


module.exports = { getAllUsers };