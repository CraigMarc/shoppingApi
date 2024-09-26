const express = require('express');
const router = express.Router();
const product_controller = require("../controllers/productController")

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// new product 

router.post("/new/", product_controller.post_product);



module.exports = router;