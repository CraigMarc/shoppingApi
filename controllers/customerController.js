const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Order = require("../models/orders");
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

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
    body("productsArray")
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

// change shippping status


exports.shipped = asyncHandler(async (req, res) => {


  let orderData = await Order.findById({ _id: req.params.orderId });


  if (orderData.shipped == true) {

    const order = new Order({

      firstName: orderData.firstName,
      lastName: orderData.lastName,
      address1: orderData.address1,
      address2: orderData.address2,
      email: orderData.email,
      town: orderData.town,
      state: orderData.state,
      zip: orderData.zip,
      shippingCost: orderData.shippingCost,
      orderCost: orderData.orderCost,
      productsArray: orderData.productsArray,
      quantity: orderData.quantity,
      shipped: false,
      _id: req.params.orderId
      
    });

    try {
      await Order.findByIdAndUpdate(req.params.orderId, order, {});
      let allOrders = await Order.find().exec()
      res.status(200).json(allOrders)
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

  if (orderData.shipped == false) {

    const order = new Order({
      firstName: orderData.firstName,
      lastName: orderData.lastName,
      address1: orderData.address1,
      address2: orderData.address2,
      email: orderData.email,
      town: orderData.town,
      state: orderData.state,
      zip: orderData.zip,
      shippingCost: orderData.shippingCost,
      orderCost: orderData.orderCost,
      productsArray: orderData.productsArray,
      quantity: orderData.quantity,
      shipped: true,
      _id: req.params.orderId

    });

    try {
      await Order.findByIdAndUpdate(req.params.orderId, order, {});
      let allOrders = await Order.find().exec()
      res.status(200).json(allOrders)
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }


})

// get all orders

exports.all_orders_get = asyncHandler(async (req, res) => {


  try {
    let allOrders = await Order.find().exec()
    res.status(200).json(allOrders)
  } catch (error) {
    res.status(500).json({ message: error });
  }

});

// delete order


exports.delete_order = asyncHandler(async (req, res) => {

  try {
    await Order.findByIdAndDelete(req.params.orderId);
    let allOrders = await Order.find().exec()
    res.status(200).json(allOrders)
  } catch (error) {
    res.status(500).json({ message: error });
  }

});

// edit order

exports.edit_order = asyncHandler(async (req, res) => {

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
      shipped: req.body.shipped,
      _id: req.params.orderId
    
  });

  try {
    await Order.findByIdAndUpdate(req.params.orderId, order, {});
    let allOrders = await Order.find().exec()
    res.status(200).json(allOrders)
  } catch (error) {
    res.status(500).json({ message: error });
  }

})

// send confirmation email

exports.post_email = asyncHandler(async (req, res) => {

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'cmar1455cr@gmail.com',
      pass: process.env.EMAIL_PASSWORD
    }
  });
  
  const mailOptions = {
    from: 'This Store <cmar1455cr@gmail.com>',
    to: 'cmarcinkiewicz2000@yahoo.com',
    subject: 'Your recent order',
    text: req.body.order_details
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
      res.send(error)
    } else {
      console.log('Email sent: ' + info.response);
      res.send('Email sent: ' + info.response)
    }
  });


});
