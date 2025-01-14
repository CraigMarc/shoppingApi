const asyncHandler = require("express-async-handler");
const multer = require("multer"); // For uploading images
const { body, validationResult } = require("express-validator")
const mongoose = require("mongoose");
const Product = require("../models/inventory");
const Category = require("../models/category");
const Brand = require("../models/brand");
const fs = require('fs');
const sharp = require('sharp');

// new brand

exports.new_brand = [

  // Handle single file upload with field name "image"
  imageUploader.single('image'),

  body("name").trim().escape(),


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

      // path: where to store resized photo
      let extArray = req.file.mimetype.split("/");
      let extension = extArray[extArray.length - 1];
      const path = `./uploads/image-${Date.now() + '.' + extension}`


      const brand = new Brand({
        name: req.body.name,
        image: path
      });
      try {
        //save and resize pic

        await sharp(req.file.buffer).resize(500, 375).toFile(path);
        await brand.save()
        let allBrands = await Brand.find().exec()
        res.status(200).json(allBrands)
      } catch (error) {
        res.status(500).json({ message: error });
      }
    }
    else {
      const brand = new Brand({
        name: req.body.name,


      });
      try {
        await brand.save()
        let allBrands = await Brand.find().exec()
        res.status(200).json(allBrands)
      } catch (error) {
        res.status(500).json({ message: error });
      }
    }


  }

]

// delete brand

exports.delete_brand = asyncHandler(async (req, res) => {


  let brandData = await Brand.findById(req.params._id);
  let productBrand = await Product.find({ brand: req.params._id });

  if (productBrand.length > 0) {
    res.status(200).json({ message: "category in use" })
  }
  else {

    if (brandData.image) {
      // delete pic
      fs.unlink(brandData.image, (err) => {
        if (err) {
          throw err;
        }

        console.log("Delete File successful.");
      });
    }

    try {
      await Brand.findByIdAndDelete(req.params._id);
      let allBrands = await Brand.find().exec()
      res.status(200).json(allBrands)
    } catch (error) {
      res.status(500).json({ message: error });
    }

  }
});

// get all brands

exports.all_brands_get = asyncHandler(async (req, res) => {


  try {
    let allBrands = await Brand.find().exec()
    res.status(200).json(allBrands)
  } catch (error) {
    res.status(500).json({ message: error });
  }

});

// add new brand image

exports.new_brand_image = [

  // Handle single file upload with field name "image"
  //upload.single("image"),
  imageUploader.single('image'),

  async function (req, res) {

    // path: where to store resized photo
    let extArray = req.file.mimetype.split("/");
    let extension = extArray[extArray.length - 1];
    const path = `./uploads/image-${Date.now() + '.' + extension}`

    try {
      //save and resize pic

      await sharp(req.file.buffer).resize(500, 375).toFile(path);
      await Brand.findByIdAndUpdate(req.params._id, { image: path });

      let allBrands = await Brand.find().exec()
      res.status(200).json(allBrands)
    } catch (error) {
      res.status(500).json({ message: error });
    }

  }


]

// delete brand image

exports.delete_brand_image = asyncHandler(async (req, res) => {


  let brandData = await Brand.findById(req.params._id);

  // delete pic
  fs.unlink(brandData.image, (err) => {
    if (err) {
      throw err;
    }

    console.log("Delete File successful.");
  });


  try {
    await Brand.findByIdAndUpdate(req.params._id, { image: "" });
    let allBrands = await Brand.find().exec()
    res.status(200).json(allBrands)
  } catch (error) {
    res.status(500).json({ message: error });
  }


});

// edit brand

exports.edit_brand = asyncHandler(async (req, res) => {


  try {
    await Brand.findByIdAndUpdate(req.params._id, { name: req.body.name });
    let allBrands = await Brand.find().exec()
    res.status(200).json(allBrands)
  } catch (error) {
    res.status(500).json({ message: error });
  }


});
