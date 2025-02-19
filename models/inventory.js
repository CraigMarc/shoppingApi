const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  title: { type: String, required: true, minLength: 1 },
  category: { type: Schema.Types.ObjectId, required: true, ref: "Category" },
  subCategory: { type: String, minLength: 1 },
  brand: { type: String, required: true, minLength: 1 },
  description: { type: String, required: true, minLength: 1 },
  modelNum: { type: String, minLength: 1 },
  product_id: { type: String, minLength: 1 },
  sale_percent: { type: Number, minLength: 1, default: 0 },
  colorArray: { type: [] }, 
  published: { type: Boolean },
   
});




// Export model
module.exports = mongoose.model("Product", ProductSchema);