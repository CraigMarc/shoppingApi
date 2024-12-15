const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  title: { type: String, required: true, minLength: 1 },
  category: { type: String, required: true, minLength: 1 },
  brand: { type: String, minLength: 1, },
  color: { type: String, minLength: 1 },
  description: { type: String, required: true, minLength: 1 },
  modelNum: { type: String, minLength: 1 },
  product_id: { type: String, minLength: 1 },
  productsArray: { type: [] }, 
  published: { type: Boolean },
   
});




// Export model
module.exports = mongoose.model("Product", ProductSchema);