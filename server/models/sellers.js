const mongoose = require('mongoose');
const { Schema } = mongoose;

const sellersSchema = new Schema({
  address: String,
  company: String,
  currency: {
    default: 'uzs',
    type: String
  },
  email: {
    required: true,
    type: String,
    unique: true
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
    default: 'seller',
    type: String
  }
});

sellersSchema.index({ email: 1 });
const Sellers = mongoose.model('Seller', sellersSchema);

module.exports = Sellers;