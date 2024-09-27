const express = require('express');
const router = express.Router();
const product_controller = require("../controllers/productController")



// new product 

router.post("/new/", product_controller.post_product);



module.exports = router;