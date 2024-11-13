const express = require('express');
const router = express.Router();
const product_controller = require("../controllers/productController")



// new product 

router.post("/new/", product_controller.post_product);

// get all products

router.get("/all/", product_controller.all_products_get);

// delete product

router.delete("/delete/:productId", product_controller.delete_product);

// publish product

router.put("/publish/:productId", product_controller.publish_product);

module.exports = router;

// edit post

router.put("/edit/:productId", product_controller.edit_product);

//delete image

router.delete("/image/:productId", product_controller.image_delete);

//add image file

router.post("/image/:productId", product_controller.image_post);

