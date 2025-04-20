


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
