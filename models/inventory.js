const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  title: { type: String, required: true, minLength: 1 },
  category: { type: Schema.Types.ObjectId, required: true, ref: "Category" },
  brand: { type: Schema.Types.ObjectId, required: true, ref: "Brand" },
  description: { type: String, required: true, minLength: 1 },
  modelNum: { type: String, minLength: 1 },
  product_id: { type: String, minLength: 1 },
  colorArray: { type: [] }, 
  published: { type: Boolean },
   
});




// Export model
module.exports = mongoose.model("Product", ProductSchema);