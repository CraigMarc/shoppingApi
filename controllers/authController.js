
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const bcrypt = require('bcryptjs')
const { body, validationResult } = require("express-validator");
const dotenv = require('dotenv');
dotenv.config();

// sign up route

// sign up route
/*
exports.sign_up = [
  // Validate and sanitize the name field.

  body("firstName")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("first name must be specified.")
    .isAlphanumeric()
    .withMessage("first name has non-alphanumeric characters."),
  body("lastName")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("last name must be specified.")
    .isAlphanumeric()
    .withMessage("last name has non-alphanumeric characters."),
  body("userName")
    .trim()
    .isLength({ min: 4 })
    .escape()
    .withMessage("UserName must be 4 characters."),

  body("password")
    .trim()
    .isLength({ min: 6 })
    .escape()
    .withMessage("Password must be at least 6 characters."),
  body('confirm').custom((value, { req }) => {
    return value === req.body.password;
  })
    .withMessage("Passwords must match."),



  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);



    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.

      res.json({ errors: errors.array() })
      return;
    }

    else {
      // Data from form is valid.
      // Check if Username already exists.
      const userNameExists = await User.findOne({ userName: req.body.userName }).exec();
      if (userNameExists) {
        // UserName exists, redirect to its detail page.

        res.json({ errors: "user name already exists" })
      } else {

        bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
          // if err, do something
          if (err) {
            res.json({ message: 'cannot encrypt' })
            return console.log('Cannot encrypt');
          }
          // otherwise, store hashedPassword in DB
          const userDetail = new User({

            firstName: req.body.firstName,
            lastName: req.body.lastName,
            userName: req.body.userName,
            password: hashedPassword,
            image: "image-1708024677240.png"
          })
          const user = new User(userDetail);
          await user.save()
          res.json({ message: "user saved" })
        })
      }
    }
  }),
];*/

// log in route

exports.log_in = asyncHandler(async (req, res, next) => {

  let { email, password } = req.body;
  try {
    let userDb = await User.find({ 'userName': email }).exec()

    const match = await bcrypt.compare(password, userDb[0].password);

    if (match == true) {

      const opts = {}
      opts.expiresIn = 2000;
      const secret = process.env.SECRET_KEY
      const token = jwt.sign({ email }, secret, opts);



      return res.status(200).json({
        message: "Auth Passed",
        token: token,
        user_id: userDb[0]._id

      })
    }


  } catch (error) {
    res.status(500).json({ message: "wrong username or password" });
  }

  return res.status(401).json({ message: "Auth Failed" })
})
