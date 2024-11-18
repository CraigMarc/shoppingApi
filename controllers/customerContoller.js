const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// get all products

exports.post_newOrder = asyncHandler(async (req, res) => {


    try {
      let allProducts = await Product.find().exec()
      res.status(200).json(allProducts)
    } catch (error) {
      res.status(500).json({ message: error });
    }
})  