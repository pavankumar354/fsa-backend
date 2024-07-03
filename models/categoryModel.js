const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    }
});
const categoryData = mongoose.model("categoryData", categorySchema);

module.exports = categoryData;