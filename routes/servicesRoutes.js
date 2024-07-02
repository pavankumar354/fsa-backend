const express = require("express");
const servicesController = require("../controllers/servicesController");
const CategoryData = require("../models/categoryModel");

const jwtAuth = require("../middlewares/jwtAuth");
const adminMiddleware = require("../middlewares/adminMiddleware");
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/images')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now();
        cb(null, uniqueSuffix + file.originalname);
    }
  })
  
const upload = multer({ storage: storage });


const router = express.Router();

// add category
router.post("/addcategory", upload.single('image'), async (req, res) => {
    // console.log("hii", req.file);
    const category = req.body.category;
    const image = req.file.filename;
    try {
        // await CategoryData.create({ category: category, image: image });
        const data = new CategoryData({
            category,
            image
          });
          data.save();
        return res.status(201).send({
            success: true,
            message: "category Registered Successfully",
          });
    } catch (error) {
        console.log(error);
    return res
      .status(500)
      .send({ success: false, message: "Internal Server Error" });
    }
})

// get categories
router.get("/categories", async (req, res) => {
    try {
        const categories = await CategoryData.find({});
        return res.status(200).send({
            success: true,
            categories:categories
          });
    } catch (error) {
        console.log(error);
    return res
      .status(500)
      .send({ success: false, message: "Internal Server Error" });
    }
})

// getting a category with id
router.route("/category/:id").get(servicesController.OneCategoryController);

// updating category
router.route("/editcategory/:id").put(servicesController.UpdateCategoryController);

// deleting category
router.route("/deletecategory/:id").delete(servicesController.DeleteCategoryController);

// add service
router.route("/addservice").post(upload.single('image'),servicesController.AddServicesController);

// get services
router.route("/allservices").get(servicesController.GetServicesController);

// querying services
router.route("/search").get(servicesController.SearchServicesController);

// getting a service with id
router.route("/service/:id").get(servicesController.OneServiceController);

// updating services
router.route("/edit/:id").put(servicesController.UpdateServicesController);

// deleting services
router.route("/delete/:id").delete(servicesController.DeleteServicesController);


    
    


module.exports = router;