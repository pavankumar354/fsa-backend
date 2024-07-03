const Vendor = require('../models/Vendor');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

// Register vendor
exports.registerVendor = async (req, res) => {
  const { serviceName, category, vendorName, email, mobileNumber, password, location } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const vendor = new Vendor({ serviceName, category, vendorName, email, mobileNumber, password: hashedPassword, location });
    await vendor.save();

    // Send email
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'janakiramudayagiri766@gmail.com',
        pass: 'ijne vteh hxre wmum'
      }
    });

    const mailOptions = {
      from: 'janakiramudayagiri766@gmail.com',
      to: email,
      subject: 'Vendor Registration',
      text: `Your account has been created.\nUsername: ${email}\nPassword: ${password}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log('Email sent: ' + info.response);
    });

    res.status(201).json({ message: 'Vendor registered successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
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

// Update vendor
exports.updateVendor = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  try {
    const vendor = await Vendor.findByIdAndUpdate(id, updateData, { new: true });
    res.status(200).json(vendor);
  } catch (error) {
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
      'Pets and Animals',
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

// Add this new function to fetch service names based on category
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
    'Pet and Animal Services': ['Veterinary Clinics', 'Pet Grooming', 'Pet Boarding and Daycare', 'Pet Training', 'Pet Sitting', 'Pet Adoption Centers', 'Animal Shelters', 'Pet Supply Stores', 'Mobile Pet Services', 'Pet Photography'],
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