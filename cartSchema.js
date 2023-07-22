// schema.js
const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true, default: 'images/product2.jpg'},
});

module.exports = mongoose.model('Item', itemSchema);
