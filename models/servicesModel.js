const mongoose = require("mongoose");

const servicesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    image: {
        type: String,
    }
});
const ServicesData = mongoose.model("ServicesData", servicesSchema);

module.exports = ServicesData;