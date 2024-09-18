

exports.get_test = function(req, res, next) {
    res.send('test works');
  };

exports.post_payment = function(req, res) {
  
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
  