
const mongoose = require('mongoose');
const validator = require('validator');

const vendorSchema = new mongoose.Schema({
 
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  serviceName: {
    type: String,
    required: [true, 'Service name is required'],
    trim: true,
    minlength: [3, 'Service name must be at least 3 characters long'],
    maxlength: [100, 'Service name must be less than 100 characters long']
  },
  vendorName: {
    type: String,
    required: [true, 'Vendor name is required'],
    trim: true,
    minlength: [3, 'Vendor name must be at least 3 characters long'],
    maxlength: [100, 'Vendor name must be less than 100 characters long']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email address']
  },
  mobileNumber: {
    type: String,
    required: [true, 'Mobile number is required'],
    validate: {
      validator: function(v) {
        return /\d{10}/.test(v);
      },
      message: props => `${props.value} is not a valid mobile number!`
    }
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [5, 'Password must be at least 5 characters long']
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
    minlength: [3, 'Location must be at least 3 characters long'],
    maxlength: [100, 'Location must be less than 100 characters long']
  },
  businessName: {
    type: String,
    required: [true, 'Business name is required'],
    trim: true,
    minlength: [3, 'Business name must be at least 3 characters long'],
    maxlength: [100, 'Business name must be less than 100 characters long']
  },
  serviceArea: {
    type: String,
    required: [true, 'Service area is required'],
    trim: true,
    minlength: [3, 'Service area must be at least 3 characters long'],
    maxlength: [100, 'Service area must be less than 100 characters long']
  },
  licenseNumber: {
    type: String,
    trim: true
  },
  licenseDocument: {
    type: String, // or Buffer
    trim: true
  },
  certifications: [
    {
      document: {
        type: String, // or Buffer
        trim: true
      }
    }
  ],
  Acess: { type: Boolean, default: true }
});

module.exports = mongoose.model('Vendor', vendorSchema);
