const express = require('express');
const router = express.Router();
const product_controller = require("../controllers/productController")
const customer_controller = require("../controllers/customerController")


// delete product

router.delete("/delete/:productId", product_controller.delete_product);

// publish product

router.put("/publish/:productId", product_controller.publish_product);

module.exports = router;

// edit post

router.put("/edit/", product_controller.edit_product);

//delete image

router.delete("/image/", product_controller.image_delete);

//add image file

//router.post("/image/", product_controller.image_post);

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

// product1

router.post("/new_product1/", product_controller.post_product1);

// send updated product info

router.post("/update_product/", product_controller.update_product);

//delete color array and pics

router.delete("/delete_color/", product_controller.delete_color);

// add category

router.post("/new_category/", product_controller.new_category);
 
// delete category

router.delete("/delete_category/:_id", product_controller.delete_category);

// new brand

router.post("/new_brand/", product_controller.new_brand);

// delete brand

router.delete("/delete_brand/:_id", product_controller.delete_brand);

// new sub category

router.post("/new_subcategory/:_id", product_controller.new_subcategory);

// delete subcategory

router.delete("/delete_subcategory/", product_controller.delete_subcategory);



