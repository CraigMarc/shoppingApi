const asyncHandler = require("express-async-handler");
const multer = require("multer"); // For uploading images
const { body, validationResult } = require("express-validator")
const mongoose = require("mongoose");
const Product = require("../models/inventory");
const Category = require("../models/category");
const fs = require('fs');
const sharp = require('sharp');

// new subcategory

exports.new_subcategory = [

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

      try {
        //save and resize pic update sub category
        let categoryData = await Category.findById(req.params._id);

        categoryData.subCategory.push({ name: req.body.name, image: path })

        await Category.findByIdAndUpdate(req.params._id, { subCategory: categoryData.subCategory });

        await sharp(req.file.buffer).resize(350, 700).toFile(path);
        // return all categories
        let allCategories = await Category.find().exec()
        res.status(200).json(allCategories)
      } catch (error) {
        res.status(500).json({ message: error });
      }
    }

    //if no picture
    else {

      try {
        // update subcategory
        let categoryData = await Category.findById(req.params._id);

        categoryData.subCategory.push({ name: req.body.name, image: "" })

        await Category.findByIdAndUpdate(req.params._id, { subCategory: categoryData.subCategory });
        // return all categories
        let allCategories = await Category.find().exec()
        res.status(200).json(allCategories)
      } catch (error) {
        res.status(500).json({ message: error });
      }
    }


  }

]

// delete subcategory


exports.delete_subcategory = asyncHandler(async (req, res) => {



  let categoryData = await Category.findById(req.body._id);
  let productSubCategory = await Product.find({ subCategory: req.body.subName });


  if (productSubCategory.length > 0) {
    res.status(200).json({ message: "category in use" })
  }

  else {

    if (categoryData.subCategory[req.body.iter].image) {
      // delete pic
      fs.unlink(categoryData.subCategory[req.body.iter].image, (err) => {
        if (err) {
          throw err;
        }

        console.log("Delete File successful.");
      });

    }


    try {


      categoryData.subCategory.splice(req.body.iter, 1)

      await Category.findByIdAndUpdate(req.body._id, { subCategory: categoryData.subCategory });

      let allCategories = await Category.find().exec()
      res.status(200).json(allCategories)
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

});

// add new subcategory image

exports.new_subcategory_image = [

    // Handle single file upload with field name "image"
    //upload.single("image"),
    imageUploader.single('image'),
  
    async function (req, res) {
  
      let categoryData = await Category.findById(req.params._id);
  
      // path: where to store resized photo
      let extArray = req.file.mimetype.split("/");
      let extension = extArray[extArray.length - 1];
      const path = `./uploads/image-${Date.now() + '.' + extension}`
  
      categoryData.subCategory[req.body.subIter].image = path
  
      try {
        //save and resize pic
  
        await sharp(req.file.buffer).resize(350, 700).toFile(path);
        await Category.findByIdAndUpdate(req.params._id, { subCategory: categoryData.subCategory });
  
        let allCategory = await Category.find().exec()
        res.status(200).json(allCategory)
      } catch (error) {
        res.status(500).json({ message: error });
      }
  
    }
  
  
  ]
  
  // delete subcategory image
  
  exports.delete_subcategory_image = asyncHandler(async (req, res) => {
  
  
    let categoryData = await Category.findById(req.params._id);
  
    // delete pic
    fs.unlink(categoryData.subCategory[req.body.subIter].image, (err) => {
      if (err) {
        throw err;
      }
  
      console.log("Delete File successful.");
    });
  
    categoryData.subCategory[req.body.subIter].image = ""
  
    try {
      await Category.findByIdAndUpdate(req.params._id, { subCategory: categoryData.subCategory });
      let allCategory = await Category.find().exec()
      res.status(200).json(allCategory)
    } catch (error) {
      res.status(500).json({ message: error });
    }
  
  
  });
  
  // edit sub category
  
  exports.edit_subcategory = asyncHandler(async (req, res) => {
  
    let categoryData = await Category.findById(req.params._id);
    let oldCategory = categoryData.subCategory[req.body.subIter].name
  
    categoryData.subCategory[req.body.subIter].name = req.body.name
  
    console.log(oldCategory)
  
    try {
      await Category.findByIdAndUpdate(req.params._id, { subCategory: categoryData.subCategory });
      // replace all subcategories in products
      
      await Product.updateMany({subCategory: oldCategory}, { subCategory: req.body.name });
  
      let allCategory = await Category.find().exec()
      res.status(200).json(allCategory)
    } catch (error) {
      res.status(500).json({ message: error });
    }
  
  
  });