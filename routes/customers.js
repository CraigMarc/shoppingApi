const express = require('express');
const router = express.Router();
const customer_controller = require("../controllers/customerController")

// new order

router.post("/newOrder/", customer_controller.post_newOrder);