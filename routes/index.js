var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var otp = require('../models/otp.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', 
    { title: 'OTP Validation' }
  );
});

router.get('/searchOtp', function(req, res, next){
  var query = {
      otp: req.query.otp
  };
  otp.findOne(query).exec(function(err, otpRes){
    res.json(
      {"status" : (!otpRes.used) ? true : false}
    );
    return;
  });
});

module.exports = router;
