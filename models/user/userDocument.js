


const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    phone: String,
    zip: String,
    email: String,
    password: String
    
});

const UserModule = mongoose.model("usersData", UserSchema);

module.exports = UserModule;
