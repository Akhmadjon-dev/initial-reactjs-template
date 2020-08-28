const bcrypt = require('bcrypt');
const Sellers = require('../models/sellers');
const util = require('../utils');

const baseUrl = process.env.REACT_APP_baseUrl || '';

exports.fetchAllSellers = (req, res) => {
  Sellers
    .find()
    .then((sellers) => res.json(sellers))
    .catch((err) => res.send(err));
};

exports.fetchSellerById = (req, res) => {
  const { id } = req.params;

  Sellers
    .findById(id)
    .then((seller) => {
      res.json(seller);
    })
    .catch((err) => res.send(err));
};

exports.deleteAllSellers = (req, res) => {
  Sellers
    .deleteMany()
    .then(() => res.json('Deleted'))
    .catch((err) => res.send(err));
};

exports.createSeller = async (req, res) => {
  const {
    webCam, name, createdAt, password, email, file
  } = req.body;
  let imgFile = null;

  if (webCam) {
    imgFile = await util.webImgtoFile(webCam, 'sellers', `${name}-${createdAt}`);
  }

  const img = file ? baseUrl + file.path.replace('public', '') : (imgFile || webCam);
  const hashedPassword = await bcrypt.hash(password, 8);
  const Seller = new Sellers({
    ...req.body, img, password: hashedPassword,
  });

  Seller
    .save()
    .then((seller) => {
      res.json(seller);
      util.resizeImg(file, 'sellers');
    })
    .catch((err) => {
      const msg = err.code === 11000 ? `Users with "${email}" email adress exists` : err.errmsg;
      res.json({ success: false, msg });
    });
};

exports.updateSellerById = async (req, res) => {
  const { id } = req.params;
  const { webCam, oldImg, updatedAt, name, } = req.body;

  let imgFile = null;

  if (webCam) {
    imgFile = await util.webImgtoFile(webCam, 'sellers', `${name}-${updatedAt}`, true, oldImg);
  }

  const img = req.file ? baseUrl + req.file.path.replace('public', '') : (imgFile || webCam || oldImg);

  const updatedData = { ...req.body, img };

  Sellers
    .findByIdAndUpdate(id, { $set: updatedData }, { new: true })
    .then((seller) => {
      res.json(seller);
      util.resizeImg(req.file, 'sellers');
    })
    .catch((err) => res.send(err));
};

exports.changeSellerAuth = async (req, res) => {
  const { id } = req.params;
  const { email, password } = req.body;

  const hash = await bcrypt.hash(password, 8);
  Sellers
    .find({ email })
    .then((seller) => {

      if ((seller.length && seller[0]._id == id) || !seller.length) {

        Sellers
          .findByIdAndUpdate(id, { $set: { email, password: hash } }, { new: true })
          .then(() => res.json({ success: true }))
          .catch((err) => res.json({ success: false, msg: err.message }));
      } else if (seller.length && seller[0]._id != id) {
        res.json({ success: false, msg: `You can't use the email. Another user has been registered with '${email}'` });
      }
    })
    .catch((err) => res.json({ success: false, msg: err.message }));
};

exports.deleteSellerById = (req, res) => {
  const { id } = req.params;
  Sellers
    .findByIdAndRemove(id)
    .then(() => {
      res.json({ success: true, msg: 'Successfully deleted' });
    })
    .catch((err) => res.send(err));
};