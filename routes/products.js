const express = require('express');
const router = express.Router();
const product_controller = require("../controllers/productController")



// new product 

router.post("/new/", product_controller.post_product);

// get all products

router.get("/all/", product_controller.all_products_get);

// delete product

router.delete("/delete/:productId", product_controller.delete_product);

module.exports = router;