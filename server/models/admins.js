const mongoose = require('mongoose');
const { Schema } = mongoose;

const adminSchema = new Schema({
  address: String,
  currency: {
    default: 'uzs',
    type: String
  },
  email: {
    required: true,
    type: String,
    unique: true,
  },
  img: String,
  language: String,
  name: String,
  password: {
    required: true,
    type: String
  },
  phone: String,
  type: {
    default: 'admin',
    type: String
  }
});

adminSchema.index({ email: 1 });
const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;