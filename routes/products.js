const express = require('express');
const router = express.Router();
const product_controller = require("../controllers/productController")
const customer_controller = require("../controllers/customerController")
const brand_controller = require("../controllers/brandController")
const category_controller = require("../controllers/categoryController")
const subCategory_controller = require("../controllers/subCategoryController")

// product routes


// delete product

router.delete("/delete/:productId", product_controller.delete_product);

// publish product

router.put("/publish/:productId", product_controller.publish_product);

module.exports = router;

// new color

router.post("/new_color/", product_controller.new_color);

// edit product

router.put("/edit/", product_controller.edit_product);

//delete product image

router.delete("/image/", product_controller.image_delete);

//add product image file

//router.post("/image/", product_controller.image_post);

// upload new product pic

router.post("/new_image/", product_controller.new_image);

// product1

router.post("/new_product1/", product_controller.post_product1);

// send updated product info

router.post("/update_product/", product_controller.update_product);

// send updated main info

router.put("/edit_main/", product_controller.edit_main);

//delete size from product

router.delete("/delete_size/", product_controller.delete_size);

//delete color array and pics

router.delete("/delete_color/", product_controller.delete_color);


//customer routes

// get all orders

router.get("/orders/", customer_controller.all_orders_get);

//change shipped status

router.put("/shipped/:orderId", customer_controller.shipped);

// edit order

router.put("/editOrder/:orderId", customer_controller.edit_order);

// delete order

router.delete("/deleteOrder/:orderId", customer_controller.delete_order);



// category routes

// add category

router.post("/new_category/", category_controller.new_category);
 
// delete category

router.delete("/delete_category/:_id", category_controller.delete_category);

//add new pic to category

router.post("/new_category_image/:_id", category_controller.new_category_image);

//delete pic from category

router.delete("/delete_category_image/:_id", category_controller.delete_category_image);

// edit category

router.put("/edit_category/:_id", category_controller.edit_category);



// brand routes

// new brand

router.post("/new_brand/", brand_controller.new_brand);

// delete brand

router.delete("/delete_brand/:_id", brand_controller.delete_brand);

//add new pic to brand

router.post("/new_brand_image/:_id", brand_controller.new_brand_image);

//delete pic from brand

router.delete("/delete_brand_image/:_id", brand_controller.delete_brand_image);

// edit brand

router.put("/edit_brand/:_id", brand_controller.edit_brand);



// subcategory routes

// new sub category

router.post("/new_subcategory/:_id", subCategory_controller.new_subcategory);

// delete subcategory

router.delete("/delete_subcategory/", subCategory_controller.delete_subcategory);

//add new pic to subcategory

router.post("/new_subcategory_image/:_id", subCategory_controller.new_subcategory_image);

//delete pic from subcategory

router.delete("/delete_subcategory_image/:_id", subCategory_controller.delete_subcategory_image);

// edit subcategory

router.put("/edit_subcategory/:_id", subCategory_controller.edit_subcategory);
