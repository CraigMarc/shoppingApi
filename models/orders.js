const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    firstName: { type: String, required: true, minLength: 1 },
    lastName: { type: String, required: true, minLength: 1 },
    address1: { type: String, required: true, minLength: 1 },
    address2: { type: String, minLength: 1 },
    email: { type: String, required: true, minLength: 1 },
    town: { type: String, required: true, minLength: 1 },
    state: { type: String, required: true, minLength: 1 },
    zip: { type: String, required: true, minLength: 1 },
    shippingCost: { type: Number, required: true, minLength: 1 },
    orderCost: { type: Number, required: true, minLength: 1 },
    productsArray: { type: [String], required: true, minLength: 1 },
    timestamp: { type: Date, default: new Date() },
    shipped: { type: Boolean, required: true, }
});


// products array array of products and the quantities

// Export model
module.exports = mongoose.model("Order", OrderSchema);