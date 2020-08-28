const express = require('express');
const router = express.Router();
const controllers = require('../controllers/products');
const multer = require('../configs/multer');

/* GET home page. */
router.get('/', controllers.fetchAllProducts);
router.post('/', multer.single('img'), controllers.createNewProducts);
router.get('/delete-all', controllers.deleteAllProducts);
router.get('/:id', controllers.fetchProductsById);
router.post('/:id/edit', multer.single('img'), controllers.updateProductsById);
router.get('/:id/delete', controllers.deleteProductsById);

module.exports = router;
