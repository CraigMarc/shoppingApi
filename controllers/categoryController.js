const asyncHandler = require("express-async-handler");
const multer = require("multer"); // For uploading images
const { body, validationResult } = require("express-validator")
const mongoose = require("mongoose");
const Product = require("../models/inventory");
const Category = require("../models/category");
const fs = require('fs');
const sharp = require('sharp');

// new category

exports.new_category = [

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


      const category = new Category({
        name: req.body.name,
        image: path
      });
      try {
        //save and resize pic

        await sharp(req.file.buffer).resize(700, 700).toFile(path);
        await category.save()
        let allCategories = await Category.find().exec()
        res.status(200).json(allCategories)
      } catch (error) {
        res.status(500).json({ message: error });
      }
    }
    else {
      const category = new Category({
        name: req.body.name,


      });
      try {
        await category.save()
        let allCategories = await Category.find().exec()
        res.status(200).json(allCategories)
      } catch (error) {
        res.status(500).json({ message: error });
      }
    }


  }

]

// get all categories

exports.all_categories_get = asyncHandler(async (req, res) => {


  try {
    let allCategories = await Category.find().exec()
    res.status(200).json(allCategories)
  } catch (error) {
    res.status(500).json({ message: error });
  }

});

// delete category

exports.delete_category = asyncHandler(async (req, res) => {


  let categoryData = await Category.findById(req.params._id);
  let productCategory = await Product.find({ category: req.params._id });

  if (productCategory.length > 0) {
    res.status(200).json({ message: "category in use" })
  }

  else {

    if (categoryData.image) {
      // delete pic
      fs.unlink(categoryData.image, (err) => {
        if (err) {
          throw err;
        }

        console.log("Delete File successful.");
      });

    }

    try {
      await Category.findByIdAndDelete(req.params._id);
      let allCategories = await Category.find().exec()
      res.status(200).json(allCategories)
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

});


// add new category image

exports.new_category_image = [

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

      await sharp(req.file.buffer).resize(700, 700).toFile(path);
      await Category.findByIdAndUpdate(req.params._id, { image: path });

      let allCategory = await Category.find().exec()
      res.status(200).json(allCategory)
    } catch (error) {
      res.status(500).json({ message: error });
    }

  }


]

// delete category image

exports.delete_category_image = asyncHandler(async (req, res) => {


  let categoryData = await Category.findById(req.params._id);

  // delete pic
  fs.unlink(categoryData.image, (err) => {
    if (err) {
      throw err;
    }

    console.log("Delete File successful.");
  });


  try {
    await Category.findByIdAndUpdate(req.params._id, { image: "" });
    let allCategory = await Category.find().exec()
    res.status(200).json(allCategory)
  } catch (error) {
    res.status(500).json({ message: error });
  }


});


// edit category

exports.edit_category = asyncHandler(async (req, res) => {


  try {
    await Category.findByIdAndUpdate(req.params._id, { name: req.body.name });
    let allCategory = await Category.find().exec()
    res.status(200).json(allCategory)
  } catch (error) {
    res.status(500).json({ message: error });
  }


});