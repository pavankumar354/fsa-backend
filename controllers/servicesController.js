const ServicesData = require("../models/servicesModel");
const CategoryData = require("../models/categoryModel");


// add services
const AddServicesController = async (req, res) => {
  try {
    // console.log(req.body)
    // await ServicesData.insertMany(req.body)
    const { name, email, phoneNumber, category, description, location } =
      req.body;
    const image = req.file.filename;
    // console.log(name)
    // console.log(image)
    const user = new ServicesData({
            name,
            email,
            phoneNumber,
            category,
            description,
      location,
            image
          });
          user.save();
          return res
            .status(201)
            .send({
              success: true, message: "Service Registered Successfully",
              user
             });
  //   const isExist = await ServicesData.findOne({ email: email });
  //   if (!isExist) {
  //     const user = new ServicesData({
  //       name,
  //       email,
  //       phoneNumber,
  //       category,
  //       description,
  //       location,
  //       image
  //     });
  //     user.save();
  //     return res
  //       .status(201)
  //       .send({
  //         success: true, message: "Service Registered Successfully",
  //         user
  //        });
  //   } else {
  //     return res.status(200).send({
  //       success: false,
  //       message: "Service Already Registered",
  //     });
  //   }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ success: false, message: "Internal Server Error" });
  }
};

// get services
const GetServicesController = async (req, res) => {
    try {
        const services = await ServicesData.find();
        return res
        .status(201)
        .send({ success: true, message: "from services", services });
        
    } catch (error) {
        console.log(error);
    return res
      .status(500)
      .send({ success: false, message: "Internal Server Error" });
    }
}

// serach services
const SearchServicesController = async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 6;
    const skip = (page - 1) * limit;
  try {
    const {name} = req.query;
    // console.log(req.query)
    const queryObject = {};
    if (name) {
      queryObject.name = {$regex:name, $options:'i'}
    }
    // console.log(queryObject)

    const totalServicesCount = await ServicesData.countDocuments();
    const totalPages = Math.ceil(totalServicesCount / limit);
    // console.log(totalPages)
    
    const services = await ServicesData.find(queryObject).skip(skip).limit(limit);
      return res
      .status(201)
      .send({ success: true, message: "search Success", services, totalServicesCount, page, limit, totalPages });
      
  } catch (error) {
      console.log(error);
  return res
    .status(500)
    .send({ success: false, message: "Internal Server Error" });
  }
}

// getting a service with id
const OneServiceController = async (req, res) => {
  try{
    //console.log(req.params)
    const {id} = req.params;
    //console.log(id)
    const result = await ServicesData.findById( {_id : id})
    //console.log(result)
    res.send(result)
}
catch(error){
    console.log(error)
}
}
// update services
const UpdateServicesController = async (req, res) => {
  try {
    //console.log(req.params)
    const { id } = req.params;
    //console.log(id)
    // console.log(req.body);
    const result = await ServicesData.findByIdAndUpdate({ _id: id }, {
      name: req.body.name,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      category: req.body.category,
      description: req.body.description,
      location: req.body.location
    })
    // console.log(result)
    res.status(200).send({ success: true, message: "Upadetd Service Successfully" });
  }
  catch (error) {
    console.log(error)
  }
};

// delete services
const DeleteServicesController = async (req, res) => {
  try {
    //console.log(req.params)
    const { id } = req.params;
    //console.log(id)
    const result = await ServicesData.findByIdAndDelete({ _id: id })
    //console.log(result)
    res.status(200).json({ success: true, message: "Service deleted successfully" });
  }
  catch (error) {
    console.log(error)
  }
};


// getting a category with id
const OneCategoryController = async (req, res) => {
  try{
    //console.log(req.params)
    const {id} = req.params;
    //console.log(id)
    const result = await CategoryData .findById( {_id : id})
    //console.log(result)
    res.send(result)
}
catch(error){
    console.log(error)
}
}

// update services
const UpdateCategoryController = async (req, res) => {
  try {
    //console.log(req.params)
    const { id } = req.params;
    //console.log(id)
    // console.log(req.body);
    const result = await CategoryData.findByIdAndUpdate({ _id: id }, {
      name: req.body.name,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      category: req.body.category,
      description: req.body.description,
      location: req.body.location,
      image: req.body.image
    })
    // console.log(result)
    res.status(200).send({ success: true, message: "Upadetd Category Successfully" });
  }
  catch (error) {
    console.log(error)
  }
};

// delete category
const DeleteCategoryController = async (req, res) => {
  try {
    //console.log(req.params)
    const { id } = req.params;
    //console.log(id)
    const result = await CategoryData.findByIdAndDelete({ _id: id })
    //console.log(result)
    res.status(200).json({ success: true, message: "Category deleted successfully" });
  }
  catch (error) {
    console.log(error)
  }
};




module.exports =
{
  AddServicesController,
  GetServicesController,
  SearchServicesController,
  OneServiceController,
  UpdateServicesController,
  DeleteServicesController,
  OneCategoryController,
  UpdateCategoryController,
  DeleteCategoryController
};