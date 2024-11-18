const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CustomerSchema = new Schema({
  firstName: { type: String, required: true, minLength: 1 },
  lastName: { type: String, required: true, minLength: 1 },
  address1: { type: String, required: true, minLength: 1 },
  address2: { type: String, minLength: 1 },
  state: { type: String, required: true, minLength: 1 },
  zip: { type: String, required: true, minLength: 5 },
  town: { type: String, required: true, minLength: 1 },
  shipped: { type: Boolean },
  
});




// Export model
module.exports = mongoose.model("Customer", CustomerSchema);