const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    email: {
        type: String
    },
    phoneNumber: {
        type: String
    },
    password: {
        type: String
    },
    googleId: {
        type: String
    }
});

const UserData = mongoose.model("UserData", userSchema);

module.exports = UserData;