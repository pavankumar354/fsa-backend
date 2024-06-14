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

passportUtility(app);
app.use(express.json());


// initialize google auth
// app.get('/google', passport.authenticate("google", {
//         scope: ['profile', 'email']
// },
// console.log("hello")
// )
    
// );

// app.get("/auth/google/callback", passport.authenticate("google", {
//     successRedirect: "http://localhost3000/dashboard",
//     failureRedirect: "http://localhost3000/login",
// }));

// app.get("/login/success", async (req, res) => {
//     console.log("req", req.user)
//     if (req.user) {
//         res.status(200).send({ message: "User Logged in", user: req.user });
//     } else {
//         res.status(400).send({ message: "Not authorized" });
//     }
// })



// connection to DB
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log("DB Connected"))
.catch((error) => console.log(error));

const PORT = process.env.PORT || 5000;

// Auth Routes
app.use("/auth", require("./routes/authRoutes"));



app.listen(PORT, () => {
    console.log(`server is running at ${process.env.PORT}`)
});