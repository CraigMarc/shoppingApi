const stripe = require("stripe")(process.env.STRIPE_KEY);
const asyncHandler = require("express-async-handler");

// endpoint for old stripe api

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

// endpoint for new stripe api

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
 