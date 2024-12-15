const express = require('express');
const router = express.Router();
const product_controller = require("../controllers/productController")
const customer_controller = require("../controllers/customerController")

// new product 

router.post("/new/", product_controller.post_product);


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

// get all orders

router.get("/orders/", customer_controller.all_orders_get);

//change shipped status

router.put("/shipped/:orderId", customer_controller.shipped);

// edit order

router.put("/editOrder/:orderId", customer_controller.edit_order);

// delete order

router.delete("/deleteOrder/:orderId", customer_controller.delete_order);

// upload new pic

router.post("/new_image/", product_controller.new_image);