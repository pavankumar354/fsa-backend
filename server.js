require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const UserData = require("./models/userModel");
const passportUtility = require("./utils/passport");
const passport = require('passport');


const app = express();

app.use((req, res, next) => {
    req.header("Access-Control-Allow-Origin", "http://localhost:3000")
    next()
})

// middleware
app.use(cors({
    origin: "http://localhost:3000",
    methods: "GET, POST, PATCH, DELETE, PUT ",
    credentials: true
}));

app.use(express.static("public"))

passportUtility(app);
app.use(express.json());


// connection to DB
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log("DB Connected"))
.catch((error) => console.log(error));

const PORT = process.env.PORT || 4444;

// Auth Routes
app.use("/auth", require("./routes/authRoutes"));

// Admin Routes
app.use("/admin", require("./routes/adminRoutes"));

// services routes
app.use("/services", require("./routes/servicesRoutes"));



app.listen(PORT, () => {
    console.log(`server is running at ${process.env.PORT}`)
});