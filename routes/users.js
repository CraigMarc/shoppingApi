const express = require('express');
const router = express.Router();
//const router = require("express").Router();
const stripe = require("stripe")(process.env.STRIPE_KEY);
const stripe_controller = require("../controllers/stripeController");
const auth_controller = require("../controllers/authController")
const usps_controller = require("../controllers/uspsController")


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// GET all comments.
router.post("/test/", stripe_controller.get_test);

// receive payment
//route for old stripe api
router.post("/payment/", stripe_controller.post_payment);

// route for new stripe api
router.post("/intent/", stripe_controller.post_intent);

// route for new user
router.post("/signup/", auth_controller.sign_up);

// route for login
router.post("/login/", auth_controller.log_in);

module.exports = router;

// usps get shippiong price

router.post("/usps/", usps_controller.post_usps);
