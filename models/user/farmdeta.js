
// // const mongoose = require('mongoose');


// // const UserModel = mongoose.model('user', {
// //     title: String,
// //     description: String,
// // });

// // module.exports = UserModel


// const mongoose = require("mongoose");

// const UserSchema = new mongoose.Schema({
//     firstName: String,
//     lastName: String,
//     phone: String,
//     zip: String,
//     email: String,
//     password: String
    
// });

// const UserModule = mongoose.model("usersData", UserSchema);

// module.exports = UserModule;



const mongoose = require("mongoose");

const landingFormSchema = new mongoose.Schema({
  inquireFor: {
    type: String,
    enum: ["Myself", "My Company"],
    required: true
  },
  subject: {
    type: String,
    enum: ["Software Engineering", "Cybersecurity"],
    required: true
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("LandingForm", landingFormSchema);
