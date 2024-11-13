const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const dotenv = require('dotenv');
dotenv.config();

// usps get shipping price

const tokenId = process.env.CLIENT_ID 
const tokenSecret = process.env.CLIENT_SECRET

exports.post_usps = asyncHandler(async (req, res) => {


  fetch("https://api.usps.com/oauth2/v3/token", {
    method: 'POST',
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },

    body: JSON.stringify({
      client_id: tokenId,
      client_secret: tokenSecret,
      grant_type: "client_credentials",
    }),


  })

    .then((response) => response.json())
    .then((data) => {
    
      fetchInfo(data.access_token)

    })

    .catch(function (err) {
      console.log("Unable to fetch -", err);
    });



  // get shipping rate
  const fetchInfo = async (token) => {

let tokenBearer = `Bearer ${token}`

    fetch("https://api.usps.com/prices/v3/base-rates/search", {
      method: 'POST',
      body: JSON.stringify({
        originZIPCode: req.body.originZIPCode,
        destinationZIPCode: req.body.destinationZIPCode,
        weight: req.body.weight,
        length: req.body.length,
        width: req.body.width,
        height: req.body.height,
        mailClass: req.body.mailClass,
        processingCategory: req.body.processingCategory,
        rateIndicator: req.body.rateIndicator,
        destinationEntryFacilityType: req.body.destinationEntryFacilityType,
        priceType: req.body.priceType
      
      }),
      headers: {
        Authorization: tokenBearer,
        'Content-type': 'application/json; charset=UTF-8',
      },

    })



      .then((response) => response.json())
      .then((data) => {
       res.json(data)

      })


      .catch((err) => {
        //console.log(err.message);

      });

  }

});
