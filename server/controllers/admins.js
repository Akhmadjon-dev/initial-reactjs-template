const bcrypt = require('bcrypt');
const Admins = require('../models/admins');
const util = require('../utils');

const baseUrl = process.env.REACT_APP_baseUrl || '';

exports.fetchAllAdmins = (req, res) => {
  Admins
    .find()
    .then((admins) => res.json(admins))
    .catch((err) => res.send(err));
};

exports.fetchAdminById = (req, res) => {
  const { id } = req.params;

  Admins
    .findById(id)
    .then((admin) => {
      res.json(admin);
    })
    .catch((err) => res.send(err));
};

exports.deleteAllAdmins = (req, res) => {
  Admins
    .deleteMany()
    .then(() => res.json('Deleted'))
    .catch((err) => res.send(err));
};

exports.createAdmin = async (req, res) => {
  const {
    webCam, name, createdAt, password, email, file
  } = req.body;
  let imgFile = null;

  if (webCam) {
    imgFile = await util.webImgtoFile(webCam, 'admins', `${name}-${createdAt}`);
  }

  const img = file ? baseUrl + file.path.replace('public', '') : (imgFile || webCam);
  const hashedPassword = await bcrypt.hash(password, 8);
  const Admin = new Admins({
    ...req.body, img, password: hashedPassword,
  });

  Admin
    .save()
    .then((admin) => {
      res.json(admin);
      util.resizeImg(file, 'admins');
    })
    .catch((err) => {
      const msg = err.code === 11000 ? `Users with "${email}" email adress exists` : err.errmsg;
      res.json({ success: false, msg });
    });
};

exports.updateAdminById = async (req, res) => {
  const { id } = req.params;
  const { webCam, oldImg, updatedAt, name, } = req.body;

  let imgFile = null;

  if (webCam) {
    imgFile = await util.webImgtoFile(webCam, 'admins', `${name}-${updatedAt}`, true, oldImg);
  }

  const img = req.file ? baseUrl + req.file.path.replace('public', '') : (imgFile || webCam || oldImg);

  const updatedData = { ...req.body, img };

  Admins
    .findByIdAndUpdate(id, { $set: updatedData }, { new: true })
    .then((admin) => {
      res.json(admin);
      util.resizeImg(req.file, 'admins');
    })
    .catch((err) => res.send(err));
};

exports.changeAdminAuth = async (req, res) => {
  const { id } = req.params;
  const { email, password } = req.body;
  console.log(req.body);

  const hash = await bcrypt.hash(password, 8);
  Admins
    .find({ email })
    .then((admin) => {
      console.log(admin);

      if ((admin.length && admin[0]._id == id) || !admin.length) {
        console.log('Success');


        Admins
          .findByIdAndUpdate(id, { $set: { email, password: hash } }, { new: true })
          .then(() => res.json({ success: true }))
          .catch((err) => res.json({ success: false, msg: err.message }));
      } else if (admin.length && admin[0]._id != id) {
        res.json({ success: false, msg: `You can't use the email. Another user has been registered with '${email}'` });
      }
    })
    .catch((err) => res.json({ success: false, msg: err.message }));
};

exports.deleteAdminById = (req, res) => {
  const { id } = req.params;
  Admins
    .findByIdAndRemove(id)
    .then(() => {
      res.json({ success: true, msg: 'Successfully deleted' });
    })
    .catch((err) => res.send(err));
};