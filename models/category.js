const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  
  name: { type: String, required: true, maxLength: 100, minLength: 3 },
  image: { type: String },
  subCategory: { type: [] },
})




// Export model
module.exports = mongoose.model("Category", CategorySchema);