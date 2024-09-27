const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    street: { type: String, required: true, minLength: 1 },
    apt: { type: String, minLength: 1 },
    town: { type: String, required: true, minLength: 1 },
    state: { type: String, required: true, minLength: 1 },
    zip: { type: Number, required: true, minLength: 1 },
    shippingCost: { type: Number, required: true, minLength: 1 },
    orderCost: { type: Number, required: true, minLength: 1 },
    products: { type: [String], required: true, minLength: 1 },
    timestamp: { type: Date, default: new Date() },
    shipped: { type: Boolean, required: true, }
});


// products array array of products and the quantities

// Export model
module.exports = mongoose.model("Order", OrderSchema);