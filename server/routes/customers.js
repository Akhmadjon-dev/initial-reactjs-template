const express = require('express');
const router = express.Router();
const controllers = require('../controllers/customers');
const multer = require('../configs/multer');

/* GET home page. */
router.get('/', controllers.fetchAllCustomers);
router.post('/', multer.single('img'), controllers.createCustomer);
router.get('/:id', controllers.fetchCustomerById);
router.post('/:id/edit', multer.single('img'), controllers.updateCustomerById);
router.get('/:id/delete', controllers.deleteCustomerById);
router.post('/:id/change-auth', controllers.changeCustomerAuth);

module.exports = router;
