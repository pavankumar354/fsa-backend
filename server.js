


require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const userDocument = require("./models/user/userDocument");
const LandingForm = require("./models/user/farmdeta");

const app = express();

// ----------------------------- MIDDLEWARE -----------------------------

// Parse incoming JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(cors({
  origin: "http://localhost:3000",
  methods: "GET, POST, PATCH, DELETE, PUT",
  credentials: true,
}));

// ----------------------------- DATABASE -----------------------------

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected"))
.catch((error) => console.error("❌ MongoDB connection error:", error));

// ----------------------------- ROUTES -----------------------------

// Get paginated user data
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
    res.status(500).send({ message: "Error fetching data", error: err });
  }
});

// Create new user
app.post("/CreateUsers", async (req, res) => {
  const { firstName, lastName, phone, zip, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new userDocument({
      firstName,
      lastName,
      phone,
      zip,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ success: true, message: "User created", user: newUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Login user
app.post("/loginUser", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userDocument.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    res.status(200).json({ success: true, message: "Login successful", user });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// Save landing form data
app.post("/saveLandingForm", async (req, res) => {
  const { inquireFor, subject } = req.body;

  try {
    const newForm = new LandingForm({ inquireFor, subject });
    await newForm.save();
    res.status(201).json({ success: true, message: "Form submitted successfully" });
  } catch (error) {
    console.error("Error saving form:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// ----------------------------- START SERVER -----------------------------

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
