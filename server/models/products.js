const mongoose = require('mongoose');
const { Schema } = mongoose;

const productsSchema = new Schema({
  basePrice: { type: Number, require: true },
  category: [{
    type: String
  }],
  color: String,
  createdAt: {
    default: Date.now(),
    type: Number
  },
  currency: {
    default: 'uzs',
    type: String
  },
  description: String,
  img: String,
  price: { type: Number, require: true },
  quantity: { type: Number, require: true },
  quantityType: String,
  seller: {
    type: Schema.Types.ObjectId
  },
  name: String,
  updatedAt: {
    default: Date.now(),
    type: Number
  },
  storeId: { type: Schema.Types.ObjectId, refPath: 'creator' },
  creator: { type: String }
});

// https://mongoosejs.com/docs/populate.html#dynamic-ref
productsSchema.index({ name: 1 });
const Products = mongoose.model('Product', productsSchema);

module.exports = Products;