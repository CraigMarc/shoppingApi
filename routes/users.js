const express = require('express');
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_KEY);
const stripe_controller = require("../controllers/stripeController");
const auth_controller = require("../controllers/authController")
const usps_controller = require("../controllers/uspsController")
const customer_controller = require("../controllers/customerController")
const product_controller = require("../controllers/productController")

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

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

// new order

router.post("/newOrder/", customer_controller.post_newOrder);

// send confirmation email

router.post("/email/", customer_controller.post_email);

// get all products

router.get("/all/", product_controller.all_products_get);

// get all brands

router.get("/brand/", product_controller.all_brands_get);

// get all categories

router.get("/category/", product_controller.all_categories_get);

// send contact email

router.post("/contact/", customer_controller.post_contact);

// check order status

router.post("/order_status/", customer_controller.order_status);




