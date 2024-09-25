const stripe = require("stripe")(process.env.STRIPE_KEY);
const asyncHandler = require("express-async-handler");

exports.get_test = function(req, res, next) {
  console.log(req.body.amount)
    res.send('test works');
  };

exports.post_payment = function(req, res) {
 console.log(req.body.tokenId)

  stripe.charges.create({
    source: req.body.tokenId,
    amount: req.body.amount,
    currency: "usd",
}, (stripeError, stripeRes) => {
    if(stripeError){
        res.status(500).json(stripeError);
    }
    else{
        res.status(200).json(stripeRes); 
    }
});
};

exports.post_intent = asyncHandler(async (req, res) => {
  

  try {
  
  const paymentIntent = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: req.body.currency,
  });

  res.json(paymentIntent)

  }

  catch (error) {
    res.status(500).json({ message: error });
  }
  
     
 });
 