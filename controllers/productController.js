const asyncHandler = require("express-async-handler");



exports.get_test = function(req, res, next) {
  console.log(req.body.amount)
    res.send('test works');
  };

  exports.post_product = function(req, res, next) {
    console.log(req.body.amount)
      res.send('test works');
    };

   