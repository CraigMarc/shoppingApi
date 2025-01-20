const asyncHandler = require("express-async-handler");
const multer = require("multer"); // For uploading images
const { body, validationResult } = require("express-validator")
const mongoose = require("mongoose");
const Product = require("../models/inventory");
const Category = require("../models/category");
const Brand = require("../models/brand");
const fs = require('fs');
const sharp = require('sharp');

/*
// set up multer for pic uploads ************* delete later

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

*/

// use multer to upload and sharp to resize pics

// use memory storage so pic can be resized

const memstorage = multer.memoryStorage();

const filter = (req, file, cb) => {
  if (file.mimetype.split("/")[0] === 'image') {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed!"));
  }
};

imageUploader = multer({
  memstorage,
  fileFilter: filter
});


// get all products

exports.all_products_get = asyncHandler(async (req, res) => {


  try {
    let allProducts = await Product.find().populate("category").populate("brand").exec()
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

    for (let i = 0; i < picProduct.colorArray.length; i++) {
      if (picProduct.colorArray[i].images) {
        for (let x = 0; x < picProduct.colorArray[i].images.length; x++) {
          let pic = picProduct.colorArray[i].images[x]
          console.log(pic)
          fs.unlink(pic, (err) => {
            if (err) {
              throw err;
            }

            console.log("Delete File successful.");
          });
        }
      }

    }


    //delete product 

    await Product.findByIdAndDelete(req.params.productId);
    let allProducts = await Product.find().populate("category").populate("brand").exec()
    res.status(200).json(allProducts)

  } catch (error) {
    res.status(500).json({ message: error });
  }

});

// publish unpublish product


exports.publish_product = asyncHandler(async (req, res) => {


  let productData = await Product.findById({ _id: req.params.productId });


  if (productData.published == true) {


    try {
      await Product.findByIdAndUpdate(req.params.productId, { published: false });
      let allProducts = await Product.find().populate("category").populate("brand").exec()
      res.status(200).json(allProducts)
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

  if (productData.published == false) {


    try {
      await Product.findByIdAndUpdate(req.params.productId, { published: true });
      let allProducts = await Product.find().populate("category").populate("brand").exec()
      res.status(200).json(allProducts)
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }


})

exports.edit_product = asyncHandler(async (req, res) => {

  const product = new Product({
    title: req.body.title,
    category: req.body.category,
    subCategory: req.body.subCategory,
    brand: req.body.brand,
    description: req.body.description,
    modelNum: req.body.modelNum,
    sale_percent: req.body.sale_percent,
    product_id: req.body.product_id,
    colorArray: req.body.colorArray,
    _id: req.body._id,

  });
  try {
    await Product.findByIdAndUpdate(req.body._id, product, {});
    let newProducts = await Product.findById(req.body._id);
    res.status(200).json(newProducts)
  } catch (error) {
    res.status(500).json({ message: error });
  }


})


// delete image

exports.image_delete = asyncHandler(async (req, res) => {


  try {

    //delete pic file

    fs.unlink(req.body.picName, (err) => {
      if (err) {
        throw err;
      }

      console.log("Delete File successful.");
    })




    // update database

    await Product.findByIdAndUpdate(req.body._id, {colorArray: req.body.colorArray});
    let newProducts = await Product.findById(req.body._id);
    res.status(200).json(newProducts)

  }
  catch (error) {
    res.status(500).send(error);
  }


})



// new image 

exports.new_image = [

  // Handle single file upload with field name "image"
  //upload.single("image"),
  imageUploader.single('image'),

  async function (req, res) {

    let productData = await Product.findById(req.body.current_id);

    // path: where to store resized photo
    let extArray = req.file.mimetype.split("/");
    let extension = extArray[extArray.length - 1];
    const path = `./uploads/image-${Date.now() + '.' + extension}`

    let newImArr = []
    if (!productData.colorArray[req.body.array_number].images) {
      newImArr.push(path)

    }
    else {
      newImArr = structuredClone(productData.colorArray[req.body.array_number].images)
      newImArr.push(path)

    }
    let newArr = { ...productData.colorArray[req.body.array_number], images: newImArr }
    productData.colorArray[req.body.array_number] = newArr


    try {
      //save and resize pic

      await sharp(req.file.buffer).resize(500, 375).toFile(path);
      await Product.findByIdAndUpdate(req.body.current_id, { colorArray: productData.colorArray });

      let newProducts = await Product.findById(req.body.current_id);
      res.status(200).json(newProducts)
    } catch (error) {
      res.status(500).json({ message: error });
    }

  }


]

// product submit new

exports.post_product1 = [

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
  body("description")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("description must be specified."),
  body("modelNum")
    .trim()
    .escape(),
  body("sale_percent")
    .trim()
    .escape(),
  body("colorArray")
    .isArray(),




  async function (req, res, next) {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.json({
        data: req.body,
        errors: errors.array(),
      });
      return;
    }


    const product = new Product({
      title: req.body.title,
      category: req.body.category,
      subCategory: req.body.subCategory,
      brand: req.body.brand,
      description: req.body.description,
      modelNum: req.body.modelNum,
      sale_percent: req.body.sale_percent,
      product_id: req.body.product_id,
      colorArray: req.body.colorArray,
      published: false

    });
    try {
      await product.save()
      let newProducts = await Product.findOne({ product_id: req.body.product_id }).populate("category").populate("brand").exec()
      res.status(200).json(newProducts)
    } catch (error) {
      res.status(500).json({ message: error });
    }



  }

]

// new color 

// update product

exports.new_color = asyncHandler(async (req, res) => {

  try {

    // update database
   
    await Product.findByIdAndUpdate(req.body._id, { colorArray: req.body.colorArray });
    
    let newProducts = await Product.findOne({ _id: req.body._id }).populate("category").populate("brand").exec()
    
    res.status(200).json(newProducts)

  }
  catch (error) {
    res.status(500).send(error);
  }

})

// update product

exports.update_product = asyncHandler(async (req, res) => {

  const product = new Product({
    title: req.body.title,
    category: req.body.category,
    subCategory: req.body.subCategory,
    brand: req.body.brand,
    description: req.body.description,
    modelNum: req.body.modelNum,
    sale_percent: req.body.sale_percent,
    product_id: req.body.product_id,
    colorArray: req.body.colorArray,
    _id: req.body._id,

  });

  try {

    // update database

    await Product.findByIdAndUpdate(req.body._id, product, {});
    let newProducts = await Product.findById(req.body._id);
    res.status(200).json(newProducts)

  }
  catch (error) {
    res.status(500).send(error);
  }


})

// delete color array and pics

exports.delete_color = asyncHandler(async (req, res) => {


  // delete pics from pic array

  if (req.body.colorArray[req.body.color_iter].images) {
    for (let x = 0; x < req.body.colorArray[req.body.color_iter].images.length; x++) {
      let pic = req.body.colorArray[req.body.color_iter].images[x]

      fs.unlink(pic, (err) => {
        if (err) {
          throw err;
        }

        console.log("Delete File successful.");
      });
    }


  }

  // delete color array

  let array2 = structuredClone(req.body.colorArray);

  array2.splice(req.body.color_iter, 1)

  const product = new Product({
    title: req.body.title,
    category: req.body.category,
    subCategory: req.body.subCategory,
    brand: req.body.brand,
    description: req.body.description,
    modelNum: req.body.modelNum,
    sale_percent: req.body.sale_percent,
    product_id: req.body.product_id,
    colorArray: array2,
    _id: req.body._id,

  });

  try {

    // update database

    await Product.findByIdAndUpdate(req.body._id, product, {});
    let newProducts = await Product.findById(req.body._id);
    res.status(200).json(newProducts)

  }
  catch (error) {
    res.status(500).send(error);
  }


})








