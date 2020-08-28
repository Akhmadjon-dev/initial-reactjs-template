const bcrypt = require('bcrypt');
const Customers = require('../models/customers');
const util = require('../utils');

const baseUrl = process.env.REACT_APP_baseUrl || '';

exports.fetchAllCustomers = (req, res) => {
  Customers
    .find()
    .then((customers) => res.json(customers))
    .catch((err) => res.send(err));
};

exports.fetchCustomerById = (req, res) => {
  const { id } = req.params;

  Customers
    .findById(id)
    .then((customer) => {
      res.json(customer);
    })
    .catch((err) => res.send(err));
};

exports.deleteAllCustomers = (req, res) => {
  Customers
    .deleteMany()
    .then(() => res.json('Deleted'))
    .catch((err) => res.send(err));
};

exports.createCustomer = async (req, res) => {
  const {
    webCam, name, createdAt, password, email, file
  } = req.body;
  let imgFile = null;

  if (webCam) {
    imgFile = await util.webImgtoFile(webCam, 'customers', `${name}-${createdAt}`);
  }

  const img = file ? baseUrl + file.path.replace('public', '') : (imgFile || webCam);
  const hashedPassword = await bcrypt.hash(password, 8);
  const Customer = new Customers({
    ...req.body, img, password: hashedPassword,
  });

  Customer
    .save()
    .then((customer) => {
      res.json(customer);
      util.resizeImg(file, 'customers');
    })
    .catch((err) => {
      const msg = err.code === 11000 ? `Users with "${email}" email adress exists` : err.errmsg;
      res.json({ success: false, msg });
    });
};

exports.updateCustomerById = async (req, res) => {
  const { id } = req.params;
  const { webCam, oldImg, updatedAt, name, } = req.body;

  let imgFile = null;

  if (webCam) {
    imgFile = await util.webImgtoFile(webCam, 'customers', `${name}-${updatedAt}`, true, oldImg);
  }

  const img = req.file ? baseUrl + req.file.path.replace('public', '') : (imgFile || webCam || oldImg);

  const updatedData = { ...req.body, img };

  Customers
    .findByIdAndUpdate(id, { $set: updatedData }, { new: true })
    .then((customer) => {
      res.json(customer);
      util.resizeImg(req.file, 'customers');
    })
    .catch((err) => res.send(err));
};

exports.changeCustomerAuth = async (req, res) => {
  const { id } = req.params;
  const { email, password } = req.body;
  console.log(req.body);

  const hash = await bcrypt.hash(password, 8);
  Customers
    .find({ email })
    .then((customer) => {
      console.log(customer);

      if ((customer.length && customer[0]._id == id) || !customer.length) {
        console.log('Success');


        Customers
          .findByIdAndUpdate(id, { $set: { email, password: hash } }, { new: true })
          .then(() => res.json({ success: true }))
          .catch((err) => res.json({ success: false, msg: err.message }));
      } else if (customer.length && customer[0]._id != id) {
        res.json({ success: false, msg: `You can't use the email. Another user has been registered with '${email}'` });
      }
    })
    .catch((err) => res.json({ success: false, msg: err.message }));
};

exports.deleteCustomerById = (req, res) => {
  const { id } = req.params;
  Customers
    .findByIdAndRemove(id)
    .then(() => {
      res.json({ success: true, msg: 'Successfully deleted' });
    })
    .catch((err) => res.send(err));
};