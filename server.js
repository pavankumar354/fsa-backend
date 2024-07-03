require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const UserData = require("./models/userModel");
const VendorData = require("./models/vendor/vendorModel")// vendor data for registration of restaurent manager
const userDocument = require("./models/user/userDocument")
const vendorRouter = require('./routes/vendorauthRoutes')//vendor router
const passportUtility = require("./utils/passport");
const passport = require('passport');
// const apiRoutes = require("./routes/apiRoutes")


const app = express();

app.use((req, res, next) => {
    req.header("Access-Control-Allow-Origin", "http://localhost:3000")
    next()
})

//vendor router
app.use(vendorRouter);
app.use("/api/users", vendorRouter);
// user routes from apiRoutes
// app.use('/api', apiRoutes); // Adjust the base path as needed

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

const PORT = process.env.PORT || 5000;

// Auth Routes
app.use("/auth", require("./routes/authRoutes"));

// Admin Routes
app.use("/admin", require("./routes/adminRoutes"));

// services routes
app.use("/services", require("./routes/servicesRoutes"));


// app.use("/User", require("./routes/authRoutes"));



app.listen(PORT, () => {
    console.log(`server is running at ${process.env.PORT}`)
});


// // user get data
// app.get("/getdata", async (req, res) => {
//     try {
//         const users = await userDocument.find({});
//         res.json(users);
//     } catch (err) {
//         res.status(500).json({ error: "An error occurred while fetching data", details: err });
//     }
// });
app.get('/getData', async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 5;
  
      const users = await userDocument.find()
        .skip(page * limit)
        .limit(limit);
  
      const total = await userDocument.countDocuments();
  
      res.json({ users, total });
    } catch (err) {
      res.status(500).send(err);
    }
  });
// user post data
app.post("/CreateUsers", async (req, res) => {
    const { name, email, number, address } = req.body;
    try {
      const newUser = new userDocument({ name, email, number, address });
      await newUser.save();
      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
//   user delete data
  app.delete('/deleteUser/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userDocument.findByIdAndDelete(id);
        if (user) {
            res.status(200).json({ message: 'User deleted successfully' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
