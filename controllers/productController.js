const asyncHandler = require("express-async-handler");
const multer = require("multer"); // For uploading images
const { body, validationResult } = require("express-validator")
const mongoose = require("mongoose");
const Product = require("../models/inventory");

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
/*
  exports.post_product = function(req, res, next) {
    console.log(req.body.amount)
      res.send('test works');
    };*/

exports.post_product = [

  // Handle single file upload with field name "image"
  upload.single("image"),

  body("title")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("title must be specified.")
    .isAlphanumeric()
    .withMessage("title has non-alphanumeric characters."),
  body("category")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("category must be specified.")
    .isAlphanumeric()
    .withMessage("catgegory has non-alphanumeric characters."),
  body("brand")
    .trim()
    .escape()
    .withMessage("brand must be specified.")
    .isAlphanumeric()
    .withMessage("brand has non-alphanumeric characters."),
  body("color")
    .trim()
    .escape()
    .withMessage("specify color"),
  body("brand")
    .trim()
    .escape()
    .withMessage("brand must be specified.")
    .isAlphanumeric()
    .withMessage("brand has non-alphanumeric characters."),
  body("description")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("description must be specified.")
    .isAlphanumeric()
    .withMessage("description has non-alphanumeric characters."),
  body("modelNum")
    .trim()
    .escape()
    .isAlphanumeric()
    .withMessage("catgegory has non-alphanumeric characters."),
  body("price")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("price must be specified.")
    .isAlphanumeric()
    .withMessage("price has non-alphanumeric characters."),
  body("quantity")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("quantity must be specified.")
    .isAlphanumeric()
    .withMessage("quantity has non-alphanumeric characters."),


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
        description: req.body.descrption,
        modelNum: req.body.modelNum,
        price: req.body.price,
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
        description: req.body.descrption,
        modelNum: req.body.modelNum,
        price: req.body.price,
        quantity: req.body.quantity,
        published: false,

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



