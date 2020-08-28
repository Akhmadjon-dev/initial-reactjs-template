const express = require('express');
const router = express.Router();
const controllers = require('../controllers/sellers');
const multer = require('../configs/multer');

/* GET home page. */
router.get('/', controllers.fetchAllSellers);
router.post('/', multer.single('img'), controllers.createSeller);
router.get('/:id', controllers.fetchSellerById);
router.post('/:id/edit', multer.single('img'), controllers.updateSellerById);
router.get('/:id/delete', controllers.deleteSellerById);
router.post('/:id/change-auth', controllers.changeSellerAuth);

module.exports = router;
