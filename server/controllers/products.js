const Products = require('../models/products');
const util = require('../utils');

const baseUrl = process.env.REACT_APP_baseUrl || '';

exports.fetchAllProducts = (req, res) => {
  Products
    .find()
    .then((data) => res.json(data))
    .catch((err) => res.send(err));
};

exports.fetchProductsById = (req, res) => {
  const { id } = req.params;

  Products
    .findById(id)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => res.send(err));
};

exports.deleteAllProducts = (req, res) => {
  Products
    .deleteMany()
    .then(() => res.json('Deleted'))
    .catch((err) => res.send(err));
};

exports.createNewProducts = async (req, res) => {
  const { webCam, name, createdAt } = req.body;
  let imgFile = null;

  if (webCam) {
    imgFile = await util.webImgtoFile(webCam, 'products', `${name}-${createdAt}`);
  }
  const img = req.file ? baseUrl + req.file.path.replace('public', '') : (imgFile || webCam);

  Products
    .create({ ...req.body, img, })
    .then((data) => {
      res.json({ success: true, payload: data, msg: 'course_created' });
      util.resizeImg(req.file, '');
    })
    .catch((err) => {
      res.json({ success: false, msg: err.message });
    });
};

exports.updateProductsById = async (req, res) => {
  const { id } = req.params;
  const {
    webCam, oldImg, updatedAt, name,
  } = req.body;

  let imgFile = null;

  if (webCam) {
    imgFile = await util.webImgtoFile(webCam, 'products', `${name}-${updatedAt}`, true, oldImg);
  }

  const img = req.file ? baseUrl + req.file.path.replace('public', '') : (imgFile || webCam || oldImg);

  const updatedData = { ...req.body, img };

  Products
    .findByIdAndUpdate(id, { $set: updatedData }, { new: true })
    .then((data) => {
      res.json({
        success: true, payload: data, msg: 'product_updated',
      });
      util.resizeImg(req.file, 'banner');
    })
    .catch((err) => res.send(err));
};


exports.deleteProductsById = (req, res) => {
  const { id } = req.params;
  Products
    .findByIdAndRemove(id)
    .then((deletedProduct) => {
      const { img } = deletedProduct;
      Products
        .find()
        .sort({ createdAt: -1 })
        .then((data) => {
          res.json({ success: true, msg: 'product_deleted', payload: data });
          // remove img
          util.deleteImg(img);
        })
        .catch((err) => res.json({ success: false, msg: err.message }));
      res.json({ success: true, msg: 'The product has been deleted' });
    })
    .catch((err) => res.send(err));
};