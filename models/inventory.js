const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  title: { type: String, required: true, minLength: 1 },
  category: { type: String, required: true, minLength: 1 },
  brand: { type: String, minLength: 1, },
  color: { type: String, minLength: 1 },
  description: { type: String, required: true, minLength: 1 },
  modelNum: { type: String, minLength: 1 },
  quantity: { type: Number, required: true, minLength: 1 },
  price: { type: Number, required: true, minLength: 1 },
  length: { type: Number, required: true, minLength: 1 },
  width: { type: Number, required: true, minLength: 1 },
  height: { type: Number, required: true, minLength: 1 },
  weight: { type: Number, required: true, minLength: 1 },
  timestamp: { type: Date, default: new Date() },
  published: { type: Boolean },
  image: { type: String }, 
});




// Export model
module.exports = mongoose.model("Product", ProductSchema);