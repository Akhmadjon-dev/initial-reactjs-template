const mongoose = require('mongoose');
const { Schema } = mongoose;

const customersSchema = new Schema({
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
    default: 'customer',
    type: String
  },
  storeId: { type: Schema.Types.ObjectId, refPath: 'creator' },
  creator: { type: String }
});

customersSchema.index({ email: 1 });
const Customers = mongoose.model('Customer', customersSchema);

module.exports = Customers;