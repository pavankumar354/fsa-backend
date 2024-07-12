const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });
  
  // Initialize upload
  const upload = multer({
    storage: storage,
    limits: { fileSize: 6000000 }, // 6MB limit
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
  
  module.exports = upload;
  