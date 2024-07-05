
const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendorController');

router.post('/register', vendorController.registerVendor);
router.post('/login', vendorController.loginVendor);
router.get('/', vendorController.getVendors);
router.put('/:id', vendorController.updateVendor);
router.delete('/:id', vendorController.deleteVendor);
router.get('/categories', vendorController.getCategories); 
router.get('/serviceNames', vendorController.getServiceNames); 

module.exports = router;
