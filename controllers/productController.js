const asyncHandler = require("express-async-handler");
const multer = require("multer"); // For uploading images
const { body, validationResult } = require("express-validator")
const mongoose = require("mongoose");
const Product = require("../models/inventory");
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

// post new product

exports.post_product = [

  // Handle single file upload with field name "image"
  // upload.single("image"),
  imageUploader.single('image'),

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
    .isNumeric()
    .escape()
    .withMessage("price must be specified."),
  body("quantity")
    .trim()
    .isLength({ min: 1 })
    .isNumeric()
    .escape()
    .withMessage("quantity must be specified."),
  body("length")
    .trim()
    .isLength({ min: 1 })
    .isNumeric()
    .escape()
    .withMessage("length must be specified."),
  body("width")
    .trim()
    .isLength({ min: 1 })
    .isNumeric()
    .escape()
    .withMessage("width must be specified."),
  body("height")
    .trim()
    .isLength({ min: 1 })
    .isNumeric()
    .escape()
    .withMessage("height must be specified."),
  body("weight")
    .trim()
    .isLength({ min: 1 })
    .isNumeric()
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

      // path: where to store resized photo
      let extArray = req.file.mimetype.split("/");
      let extension = extArray[extArray.length - 1];
      const path = `./uploads/image-${Date.now() + '.' + extension}`

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
        image: path
      });
      try {


        await product.save()
        let allProducts = await Product.find().exec()

        //save and resize pic
        await sharp(req.file.buffer).resize(500, 375).toFile(path);

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
      description: productData.description,
      modelNum: productData.modelNum,
      published: productData.published,
      colorArray: productData.colorArray,
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
      description: productData.description,
      modelNum: productData.modelNum,
      published: productData.published,
      colorArray: productData.colorArray,
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
 
  const product = new Product({
    title: req.body.title,
    category: req.body.category,
    brand: req.body.brand,
    description: req.body.description,
    modelNum: req.body.modelNum,
    product_id: req.body.product_id,
    colorArray: req.body.colorArray,
    _id: req.body._id,

  });

  try {

    //delete pic file

    fs.unlink(req.body.picName, (err) => {
      if (err) {
        throw err;
      }

      console.log("Delete File successful.");
    })




    // update database

    await Product.findByIdAndUpdate(req.body._id, product, {});
    let newProducts = await Product.findById(req.body._id);
    res.status(200).json(newProducts)

  }
  catch (error) {
    res.status(500).send(error);
  }


})

// add new pic to edit
/*
exports.image_post = [

  // Handle single file upload with field name "image"
  //upload.single("image"),
  imageUploader.single('image'),

  async function (req, res) {


    let productData = await Product.findById(req.params.productId);

    // path: where to store resized photo
    let extArray = req.file.mimetype.split("/");
    let extension = extArray[extArray.length - 1];
    const path = `./uploads/image-${Date.now() + '.' + extension}`


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
      image: path
    });

    try {
      //save and resize pic
      await sharp(req.file.buffer).resize(500, 375).toFile(path);

      await Product.findByIdAndUpdate(req.params.productId, product, {});
      let allProducts = await Product.find().exec()
      res.status(200).json(allProducts)
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }


]*/
/*
exports.image_post = [

  // Handle single file upload with field name "image"
  //upload.single("image"),
  imageUploader.single('image'),

  async function (req, res) {
    console.log(req.body)
    console.log(req.file)

    //let productData = await Product.findById(req.body.current_id);

    // path: where to store resized photo
    let extArray = req.file.mimetype.split("/");
    let extension = extArray[extArray.length - 1];
    const path = `./uploads/image-${Date.now() + '.' + extension}`

    let newColorArray = structuredClone(req.body.colorArray)

    let newImArr = []
    if (!newColorArray[req.body.colorIter].images) {
      newImArr.push(path)

    }
    else {
      newImArr = structuredClone(newColorArray[req.body.colorIter].images)
      newImArr.push(path)

    }
    let newArr = { ...newColorArray[req.body.colorIter], images: newImArr }
    newColorArray[req.body.colorIter] = newArr

//console.log(newColorArray)
/*
    const product = new Product({

      title: req.body.title,
      category: req.body.category,
      brand: req.body.brand,
      description: req.body.description,
      modelNum: req.body.modelNum,
      published: req.body.published,
      colorArray: req.body.colorArray,
      product_id: req.body.product_id,
      _id: req.body._id,
    });

    try {
      //save and resize pic
      await sharp(req.file.buffer).resize(500, 375).toFile(path);

      await Product.findByIdAndUpdate(req.body.current_id, product, {});
      let newProducts = await Product.findById(req.body.current_id);
      res.status(200).json(newProducts)
    } catch (error) {
      res.status(500).json({ message: error });
    }

  }


]*/

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
  

    const product = new Product({

      title: productData.title,
      category: productData.category,
      brand: productData.brand,
      description: productData.description,
      modelNum: productData.modelNum,
      published: productData.published,
      colorArray: productData.colorArray,
      _id: req.body.current_id,
    });

    try {
      //save and resize pic
      
      await sharp(req.file.buffer).resize(500, 375).toFile(path);
      await Product.findByIdAndUpdate(req.body.current_id, product, {});
      
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
      brand: req.body.brand,
      description: req.body.description,
      modelNum: req.body.modelNum,
      product_id: req.body.product_id,
      colorArray: req.body.colorArray,
      published: false

    });
    try {
      await product.save()
      let newProducts = await Product.findOne({ product_id: req.body.product_id }).exec()
      res.status(200).json(newProducts)
    } catch (error) {
      res.status(500).json({ message: error });
    }



  }

]

// update product

exports.update_product = asyncHandler(async (req, res) => {
 
  const product = new Product({
    title: req.body.title,
    category: req.body.category,
    brand: req.body.brand,
    description: req.body.description,
    modelNum: req.body.modelNum,
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