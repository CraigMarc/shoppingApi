const asyncHandler = require("express-async-handler");
const multer = require("multer"); // For uploading images
const { body, validationResult } = require("express-validator")
const mongoose = require("mongoose");
const Product = require("../models/inventory");
const fs = require('fs');

// set up multer for pic uploads

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    let extArray = file.mimetype.split("/");
    let extension = extArray[extArray.length - 1];
    cb(null, file.fieldname + '-' + Date.now() + '.' + extension)
  }
})

// only allow jpeg and png files

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }

}

const upload = multer({
  storage: storage,
  fileFilter: fileFilter
});

// post new product

    exports.post_product = [

      // Handle single file upload with field name "image"
      upload.single("image"),
    
      body("title")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("title must be specified."),
      body("category")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("category must be specified."),
      body("brand")
        .trim()
        .escape(),
      body("color")
        .trim()
        .escape(),
      body("brand")
        .trim()
        .escape(),
      body("description")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("description must be specified."),
      body("modelNum")
        .trim()
        .escape(),
      body("price")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("price must be specified."),
      body("quantity")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("quantity must be specified."),
      body("length")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("length must be specified."),
      body("width")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("width must be specified."),
      body("height")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("height must be specified."),
      body("weight")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("weight must be specified."),
       
    
      async function (req, res, next) {
    
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          
          res.json({
            data: req.body,
            errors: errors.array(),
          });
          return;
        }
    
    
        if (req.file) {
          const product = new Product({
            title: req.body.title,
            category: req.body.category,
            brand: req.body.brand,
            color: req.body.color,
            description: req.body.description,
            modelNum: req.body.modelNum,
            price: req.body.price,
            length: req.body.length,
            width: req.body.width,
            height: req.body.height,
            weight: req.body.weight,
            quantity: req.body.quantity,
            published: false,
            image: req.file.filename
          });
          try {
            await product.save()
            let allProducts = await Product.find().exec()
            res.status(200).json(allProducts)
          } catch (error) {
            res.status(500).json({ message: error });
          }
        }
        else {
          const product = new Product({
            title: req.body.title,
            category: req.body.category,
            brand: req.body.brand,
            color: req.body.color,
            description: req.body.description,
            modelNum: req.body.modelNum,
            price: req.body.price,
            length: req.body.length,
            width: req.body.width,
            height: req.body.height,
            weight: req.body.weight,
            quantity: req.body.quantity,
            published: false
    
          });
          try {
            await product.save()
            let allProducts = await Product.find().exec()
            res.status(200).json(allProducts)
          } catch (error) {
            res.status(500).json({ message: error });
          }
        }
    
    
      }
    
    ]
    
// get all products

exports.all_products_get = asyncHandler(async (req, res) => {


  try {
    let allProducts = await Product.find().exec()
    res.status(200).json(allProducts)
  } catch (error) {
    res.status(500).json({ message: error });
  }

});

// delete product


exports.delete_product = asyncHandler(async (req, res) => {

  try {
    //find pic file
    let picProduct = await Product.findById(req.params.productId);

    //delete pic file
    if (picProduct.image) {
      fs.unlink("./uploads/" + picProduct.image, (err) => {
        if (err) {
          throw err;
        }

        console.log("Delete File successful.");
      });
    }

    //delete product 

    await Product.findByIdAndDelete(req.params.productId);
    let allProducts = await Product.find().exec()
    res.status(200).json(allProducts)
  } catch (error) {
    res.status(500).json({ message: error });
  }

});

// publish unpublish product


exports.publish_product = asyncHandler(async (req, res) => {


  let productData = await Product.findById({ _id: req.params.productId });



  if (productData.published == true) {

    const product = new Product({

      title: productData.title,
      category: productData.category,
      brand: productData.brand,
      color: productData.color,
      description: productData.description,
      modelNum: productData.modelNum,
      price: productData.price,
      length: productData.length,
      width: productData.width,
      height: productData.height,
      weight: productData.weight,
      quantity: productData.quantity,
      published: false,
      _id: req.params.productId
    });

    try {
      await Product.findByIdAndUpdate(req.params.productId, product, {});
      let allProducts = await Product.find().exec()
      res.status(200).json(allProducts)
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

  if (productData.published == false) {

    const product = new Product({

      title: productData.title,
      category: productData.category,
      brand: productData.brand,
      color: productData.color,
      description: productData.description,
      modelNum: productData.modelNum,
      price: productData.price,
      length: productData.length,
      width: productData.width,
      height: productData.height,
      weight: productData.weight,
      quantity: productData.quantity,
      published: true,
      _id: req.params.productId

    });

    try {
      await Product.findByIdAndUpdate(req.params.productId, product, {});
      let allProducts = await Product.find().exec()
      res.status(200).json(allProducts)
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }


})

// edit product

exports.edit_product = asyncHandler(async (req, res) => {

  const product = new Product({

    title: req.body.title,
      category: req.body.category,
      brand: req.body.brand,
      color: req.body.color,
      description: req.body.description,
      modelNum: req.body.modelNum,
      price: req.body.price,
      length: req.body.length,
      width: req.body.width,
      height: req.body.height,
      weight: req.body.weight,
      quantity: req.body.quantity,
      published: req.body.published,
      _id: req.params.productId
    
  });

  try {
    await Product.findByIdAndUpdate(req.params.productId, product, {});
    let allProducts = await Product.find().exec()
    res.status(200).json(allProducts)
  } catch (error) {
    res.status(500).json({ message: error });
  }

})

// delete image

exports.image_delete = asyncHandler(async (req, res) => {

  try {
    //find pic file
    let picProduct = await Product.findById(req.params.productId);

    //delete pic file
    if (picProduct.image) {
      fs.unlink("./uploads/" + picProduct.image, (err) => {
        if (err) {
          throw err;
        }

        console.log("Delete File successful.");
      });
    }

    // update database

    await Product.findByIdAndUpdate(req.params.productId, { $unset: { image: "" } });
    let allProduct = await Product.find().exec()
    res.status(200).json(allProduct)

  }
  catch (error) {
    res.status(500).json({ message: error });
  }


})

// add picture to post

exports.image_post = [

  // Handle single file upload with field name "image"
  upload.single("image"),


  async function (req, res) {


    let productData = await Product.findById(req.params.productId);


    const product = new Product({
      
      title: productData.title,
      category: productData.category,
      brand: productData.brand,
      color: productData.color,
      description: productData.description,
      modelNum: productData.modelNum,
      price: productData.price,
      length: productData.length,
      width: productData.width,
      height: productData.height,
      weight: productData.weight,
      quantity: productData.quantity,
      published: productData.published,
      _id: req.params.productId,
      image: req.file.filename
    });

    try {
      await Product.findByIdAndUpdate(req.params.productId, product, {});
      let allProducts = await Product.find().exec()
      res.status(200).json(allProducts)
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }


]


