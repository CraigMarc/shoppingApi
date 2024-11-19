const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Order = require("../models/orders");

// new order
/*
exports.post_newOrder = asyncHandler(async (req, res) => {


  res.send('respond with a resource');
})*/

// new order

exports.post_newOrder = [

  body("firstName")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("first name must be specified."),
  body("lastName")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("last name must be specified."),
  body("email")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("email must be specified."),
  body("address1")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("address 1 must be specified.")
    .escape(),
  body("address2")
    .trim()
    .escape(),
  body("town")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("town must be specified."),
  body("state")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("state must be specified."),
  body("zip")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("zip must be specified."),
  body("shippingCost")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("shipping cost must be specified."),
  body("orderCost")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("order cost must be specified."),
  body("productsArray")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("products array must be specified."),
   

  async function (req, res, next) {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {

      res.json({
        data: req.body,
        errors: errors.array(),
      });
      return;
    }

    const order = new Order({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      address1: req.body.address1,
      address2: req.body.address2,
      email: req.body.email,
      town: req.body.town,
      state: req.body.state,
      zip: req.body.zip,
      shippingCost: req.body.shippingCost,
      orderCost: req.body.orderCost,
      productsArray: req.body.productsArray,
      quantity: req.body.quantity,
      shipped: false

    });
    try {
      await order.save()
      let allOrders = await Order.find().exec()
      res.status(200).json(allOrders)
    } catch (error) {
      res.status(500).json({ message: error });
    }



  }

]