const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['Vegetables', 'Fruits', 'Grains', 'Seeds', 'Other','Supplies'],
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  unit: {
    type: String,
    required: true,
  },
  seller: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    match: [/^\+?[0-9\s\-()]+$/, 'Please enter a valid phone number']
  },
  description: {
    type: String,
  },
  image: {
    type: String,
  }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
