const express = require("express");
const adminController = require("../controllers/adminController");
const jwtAuth = require("../middlewares/jwtAuth");
const adminMiddleware = require("../middlewares/adminMiddleware");



const router = express.Router();

router.route("/users").get(jwtAuth, adminMiddleware, adminController.getAllUsers);


    
    


module.exports = router;