var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var otp = require('../models/otp.js');

/// TODO: REFACTOR [INPUTQTY]
const inputQty = 4;

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'OTP Validation' });
});

router.post('/searchOtp', function(req, res, next) {

    let otpNumber = req.body.code;
    console.log(!isNaN(otpNumber));
    if (!isNaN(otpNumber) && otpNumber.toString().length == inputQty) {
        let otpModel = {
            otp: otpNumber
        };

        otp.findOne(otpModel).exec(function(err, otpRes) {

            if (err)
                return res.json({ "available": false });

            let availableNumber = (otpRes == null || !otpRes.used);

            if (availableNumber) {
                let doc = new otp({
                    otp: otpModel.otp,
                    used: true
                });
                doc.save(function(err, doc) {
                    if (err) return console.error(err);
                    console.log("Document inserted succussfully!");
                });
            }
            res.json({ "status": availableNumber ? true : false });
            return;
        });
    } else
        res.json({ "error": "This value is not valid" });
    return;
});


module.exports = router;