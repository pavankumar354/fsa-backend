const Vendor = require('../../models/Admin-Vendor');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');

// Set storage engine for multer
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Initialize upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 }, // 10MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
}).fields([
  { name: 'licenseDocument', maxCount: 1 },
  { name: 'certifications', maxCount: 10 }
]);

// Check file type
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|pdf/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Error: Images and PDFs only!'));
  }
}

// Register vendor
exports.registerVendor = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    console.log('Form data:', req.body);
    console.log('Files:', req.files);

    const {
      serviceName, category, vendorName, email, mobileNumber, password, location,
      businessName, serviceArea, licenseNumber, Acess
    } = req.body;

    let licenseDocument = '';
    if (req.files && req.files['licenseDocument']) {
      licenseDocument = req.files['licenseDocument'][0].path;
    }

    let certifications = [];
    if (req.files && req.files['certifications']) {
      certifications = req.files['certifications'].map(file => ({ document: file.path }));
    }

    try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 7);

      // Create a new vendor instance
      const vendor = new Vendor({
        serviceName, category, vendorName, email, mobileNumber, password: hashedPassword, location,
        businessName, serviceArea, licenseNumber, licenseDocument, certifications, Acess
      });

      // Save the vendor to the database
      await vendor.save();

      // Send email to the vendor
      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: process.env.EMAIL_USER, // Move credentials to environment variables
          pass: process.env.EMAIL_PASS  // Move credentials to environment variables
        }
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Welcome to Find Dubai - Vendor Account Created',
        text: `Dear ${vendorName},

Welcome to Find Dubai!

Your vendor account has been successfully created. Here are your login credentials:

Username: ${email}
Password: ${password}

You can log in to your account using the following link: "testlink"

Once logged in, you can update your profile, manage your services, and start reaching out to potential customers.

If you have any questions or need assistance, feel free to contact our support team at janakiramudayagiri@gmail.com or +91 766xxxxxxx.

We look forward to your success with Find Dubai!

Best regards,
Janakiram (sample)
Admin
Find Dubai`
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
        } else {
          console.log('Email sent:', info.response);
        }
      });

      res.status(201).json({ message: 'Vendor registered successfully' });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: error.message });
    }
  });
};




// Login vendor
exports.loginVendor = async (req, res) => {
  const { email, password } = req.body;
  try {
    const vendor = await Vendor.findOne({ email });
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });

    const isMatch = await bcrypt.compare(password, vendor.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    res.status(200).json({ message: 'Login successful', vendor });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all vendors
exports.getVendors = async (req, res) => {
  const { page = 0, limit = 10 } = req.query;

  try {
    const vendors = await Vendor.find()
      .skip(page * limit)
      .limit(parseInt(limit));

    const total = await Vendor.countDocuments();

    res.status(200).json({ vendors, total });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//update vendor
exports.updateVendor = async (req, res) => {
  const { id } = req.params;

  console.log('Files received:', req.files);  // Add this log
  console.log('Form data:', req.body);

  const updateData = req.body;

  if (req.files && req.files['licenseDocument']) {
    updateData.licenseDocument = req.files['licenseDocument'][0].path;
  }

  if (req.files && req.files['certifications']) {
    updateData.certifications = req.files['certifications'].map(file => ({ document: file.path }));
  }

  try {
    // Check if password is being updated
    if (updateData.password) {
      // Store the plain text password before hashing
      const plainTextPassword = updateData.password;

      // Hash the new password
      updateData.password = await bcrypt.hash(updateData.password, 10);
      
      // Include plain text password in email
      updateData.plainTextPassword = plainTextPassword;
    }

    const vendor = await Vendor.findByIdAndUpdate(id, updateData, { new: true });

    // Send email to the vendor
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: vendor.email, 
      subject: 'Find Dubai - Vendor Profile Updated',
      text: `Dear ${vendor.vendorName},

Your vendor profile on Find Dubai has been updated successfully.

Here are the updated details:
Service Name: ${vendor.serviceName}
Category: ${vendor.category}
Vendor Name: ${vendor.vendorName}
Email: ${vendor.email}
Password: ${updateData.plainTextPassword} 
Mobile Number: ${vendor.mobileNumber}
Location: ${vendor.location}
Business Name: ${vendor.businessName}
Service Area: ${vendor.serviceArea}
License Number: ${vendor.licenseNumber}
Access: ${vendor.Acess}

Thank you for keeping your profile up-to-date with us.

Best regards,
Janakiram (sample)
Admin
Find Dubai`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });

    res.status(200).json(vendor);
  } catch (error) {
    console.error('Update error:', error); 
    res.status(500).json({ error: error.message });
  }
};




// Delete vendor
exports.deleteVendor = async (req, res) => {
  const { id } = req.params;
  try {
    await Vendor.findByIdAndDelete(id);
    res.status(200).json({ message: 'Vendor deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all categories
exports.getCategories = async (req, res) => {
  try {
    const categories = [
      'Home Services',
      'Beauty and Personal Care',
      'Automotive Services',
      'Health and Fitness',
      'Professional Services',
      'Events and Entertainment',
      'Education and Tutoring',
      'Food and Dining',
      'Pet and Animal Services',
      'Real Estate Services',
      'Travel and Transportation',
      'Home Improvement',
      'Technology Services',
      'Financial Services',
      'Personal Services',
      'Wellness and Alternative Medicine',
      'Arts and Crafts',
      'Sports and Recreation'
    ];
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fetch service names based on category
exports.getServiceNames = async (req, res) => {
  const { category } = req.query;
  const services = {
    'Home Services': ['Plumbing Services', 'Electrical Services', 'HVAC Services', 'Appliance Repair', 'House Cleaning', 'Pest Control', 'Handyman Services', 'Painting Services', 'Roofing Services', 'Carpentry Services'],
    'Beauty and Personal Care': ['Hair Salons', 'Beauty Salons', 'Spas and Wellness Centers', 'Nail Salons', 'Barber Shops', 'Massage Therapists', 'Tattoo and Piercing Studios', 'Makeup Artists', 'Personal Trainers', 'Dieticians and Nutritionists'],
    'Automotive Services': ['Auto Repair Shops', 'Car Wash and Detailing', 'Auto Body Shops', 'Tire Shops', 'Mobile Mechanics', 'Car Rental Services', 'Towing Services', 'Auto Glass Repair', 'Motorcycle Repair'],
    'Health and Fitness': ['Gyms and Fitness Centers', 'Yoga Studios', 'Personal Training', 'Nutritional Counseling', 'Physical Therapy', 'Sports Coaching', 'Martial Arts Studios', 'Dance Studios', 'Wellness Workshops', 'Health Retreats'],
    'Professional Services': ['Legal Services', 'Financial Planning', 'Accounting Services', 'Real Estate Services', 'IT Services', 'Marketing and Advertising', 'Consulting Services', 'Graphic Design', 'Photography', 'Writing and Editing Services'],
    'Events and Entertainment': ['Event Planning', 'Catering Services', 'DJ Services', 'Photography and Videography', 'Live Bands and Musicians', 'Party Rentals', 'Entertainers (Magicians, Clowns, etc.)', 'Event Venues', 'Event Decorators', 'Corporate Entertainment'],
    'Education and Tutoring': ['Private Tutoring', 'Test Preparation (SAT, GRE, etc.)', 'Language Classes', 'Music Lessons', 'Art Classes', 'STEM Education', 'Driving Schools', 'Online Learning Platforms', 'Educational Workshops', 'Summer Camps'],
    'Food and Dining': ['Restaurants', 'Catering Services', 'Food Trucks', 'Bakeries and Dessert Shops', 'Coffee Shops', 'Wine and Spirits', 'Farmers Markets', 'Specialty Food Stores', 'Meal Prep Services', 'Food Delivery Services'],
    'Pet and Animal Services': ['Veterinary Clinics','Pet Grooming', 'Pet Boarding and Daycare', 'Pet Training', 'Pet Sitting', 'Pet Adoption Centers', 'Animal Shelters', 'Pet Supply Stores', 'Mobile Pet Services', 'Pet Photography'],
    'Real Estate Services': ['Real Estate Agents', 'Property Management', 'Real Estate Appraisal', 'Real Estate Consulting', 'Mortgage Brokers', 'Real Estate Investment', 'Home Staging', 'Real Estate Photography', 'Commercial Real Estate', 'Real Estate Development'],
    'Travel and Transportation': ['Travel Agencies', 'Taxi and Rideshare Services', 'Chauffeur Services', 'Bike Rentals', 'Boat Charters', 'Bus Services', 'Flight Booking', 'Tour Guides', 'Carpooling Services', 'Airport Shuttles'],
    'Home Improvement': ['Interior Design', 'Landscaping Services', 'Pool Services', 'Home Automation', 'Security Systems Installation', 'Solar Panel Installation', 'Window Installation', 'Flooring Services', 'Kitchen Remodeling', 'Bathroom Remodeling'],
    'Technology Services': ['Computer Repair', 'Smartphone Repair', 'IT Support', 'Web Development', 'Software Development', 'Network Installation', 'Data Recovery', 'Cybersecurity Services', 'Tech Consulting', 'Home Theater Installation'],
    'Financial Services': ['Tax Services', 'Loan Services', 'Credit Repair', 'Insurance Agents', 'Wealth Management', 'Bookkeeping', 'Payroll Services', 'Investment Advisory', 'Retirement Planning', 'Financial Audits'],
    'Personal Services': ['Personal Shoppers', 'Life Coaches', 'Personal Assistants', 'Errand Services', 'Laundry Services', 'Home Organization', 'Elder Care Services', 'Childcare Services', 'Personal Chef Services', 'Personal Stylists'],
    'Wellness and Alternative Medicine': ['Chiropractic Services', 'Acupuncture', 'Herbal Medicine', 'Aromatherapy', 'Meditation Centers', 'Hypnotherapy', 'Reflexology', 'Homeopathy', 'Naturopathy', 'Reiki Healing'],
    'Arts and Crafts': ['Craft Stores', 'Pottery Classes', 'Painting Classes', 'Knitting and Sewing Classes', 'Scrapbooking Services', 'Jewelry Making Classes', 'Woodworking Classes', 'Glass Blowing Classes', 'Calligraphy Classes', 'Leather Crafting Classes'],
    'Sports and Recreation': ['Sports Clubs', 'Recreational Centers', 'Outdoor Adventure Guides', 'Fitness Boot Camps', 'Sports Equipment Rentals', 'Golf Courses', 'Tennis Lessons', 'Swimming Lessons', 'Ski Instructors', 'Surfing Lessons']



  };

  try {
    const serviceNames = services[category] || [];
    res.status(200).json(serviceNames);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};