const express = require('express');
const router = express.Router();
//const router = require("express").Router();
const stripe = require("stripe")(process.env.STRIPE_KEY);
const stripe_controller = require("../controllers/stripeController");

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// GET all comments.
router.get("/test/", stripe_controller.get_test);

// receive payment

router.post("/payment/", stripe_controller.post_payment);

module.exports = router;
