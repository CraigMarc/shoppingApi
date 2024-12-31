const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const BrandSchema = new Schema({
  
  name: { type: String, required: true, maxLength: 100, minLength: 3 },
  image: { type: String }
  
})




// Export model
module.exports = mongoose.model("Brand", BrandSchema);