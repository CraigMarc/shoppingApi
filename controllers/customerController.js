const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Order = require("../models/orders");
const Product = require("../models/inventory");
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();


// new order

exports.post_newOrder = [

  body("orderId")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("orderId must be specified."),
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
    .isNumeric()
    .escape()
    .withMessage("shipping cost must be specified."),
  body("orderCost")
    .trim()
    .isLength({ min: 1 })
    .isNumeric()
    .escape()
    .withMessage("order cost must be specified."),
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
      orderId: req.body.orderId,
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
      shipped: false

    });


    try {

      let duplicate = await Order.findOne({ orderId: req.body.orderId });

      if (duplicate) {

        return res.json({ message: "duplicate order" })
      }

      if (!duplicate) {
        await order.save()
      }

      // loop through product array and subtract from inventory
      for (let i = 0; i < req.body.productsArray.length; i++) {
        // find products
        let productFind = await Product.findById(req.body.productsArray[i].id);

        let newQuantity = productFind.colorArray[req.body.productsArray[i].colorIter].sizeArray[req.body.productsArray[i].sizeIter].quantity - req.body.productsArray[i].quantity
        productFind.colorArray[req.body.productsArray[i].colorIter].sizeArray[req.body.productsArray[i].sizeIter].quantity = newQuantity

        await Product.findByIdAndUpdate(req.body.productsArray[i].id, { colorArray: productFind.colorArray });

      }

      //let allOrders = await Order.find().exec()
      res.status(200).json({ message: "product updated" })

    } catch (error) {
      res.status(500).json({ message: error });
    }



  }

]

// change shippping status


exports.shipped = asyncHandler(async (req, res) => {


  let orderData = await Order.findById({ _id: req.params.orderId });

  

  if (orderData.shipped == true) {


    try {


      await Order.findByIdAndUpdate(req.params.orderId, {shipped: false});
      let allOrders = await Order.find().exec()
      res.status(200).json(allOrders)
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

  if (orderData.shipped == false) {


    try {
      await Order.findByIdAndUpdate(req.params.orderId, {shipped: true});
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

  let duplicate = await Order.findOne({ orderId: req.body.orderId });

  if (!duplicate) {

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'cmar1455cr@gmail.com',
        pass: process.env.EMAIL_PASSWORD
      }
    });

    const mailOptions = {
      from: 'This Store <cmar1455cr@gmail.com>',
      to: req.body.email,
      subject: 'Your recent order',
      text: req.body.order_details
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        res.send(error)
      } else {
        console.log('Email sent: ' + info.response);
        res.json({ Email: "sent" + info.response })
      }
    });

  }

  else {
    res.json({ Email: "not sent duplicate" })
  }


});


// send contact email

exports.post_contact = asyncHandler(async (req, res) => {

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
      subject: req.body.subject,
      text: req.body.message
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        res.send(error)
      } else {
        console.log('Email sent: ' + info.response);
        res.json({ Email: "sent"  })
      }
    });


});

// check order status

exports.order_status = asyncHandler(async (req, res) => {

  try {
    let allOrders = await Order.find({email: req.body.email}).exec()
    res.status(200).json(allOrders)
  } catch (error) {
    res.status(500).json({ message: error });
  }

});

