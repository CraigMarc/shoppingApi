var express = require('express');
var router = express.Router();
const stripe_controller = require("../controllers/stripeController");

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// GET all comments.
router.get("/test/", stripe_controller.get_test);

module.exports = router;
