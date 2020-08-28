const express = require('express');
const router = express.Router();
const controllers = require('../controllers/admins');
const multer = require('../configs/multer');

/* GET home page. */
router.get('/', controllers.fetchAllAdmins);
router.post('/', multer.single('img'), controllers.createAdmin);
router.get('/:id', controllers.fetchAdminById);
router.post('/:id/edit', multer.single('img'), controllers.updateAdminById);
router.get('/:id/delete', controllers.deleteAdminById);
router.post('/:id/change-auth', controllers.changeAdminAuth);

module.exports = router;
