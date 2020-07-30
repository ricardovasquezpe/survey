var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var otp = require('../models/otp.js');
var nodemailer = require('nodemailer');

/// TODO: THESE ITEMS NEED TO BE CHANGED
const email = "dev.ecobridge@gmail.com";
const pass = 'Pimienta123$';
const subject = 'Form Information';
const emailService = 'gmail';
const emailToSend = "zeck.danielle@gmail.com";

const errorRes = { "error": "This value is not valid", "status": false };
const sucessEmailRes = { "success": "mail sent", "status": true };

/// TODO: REFACTOR [INPUTQTY]
const inputQty = 4;


var transporter = nodemailer.createTransport({
    service: emailService,
    auth: {
        user: email,
        pass: pass,
    }
});

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'OTP Validation' });
});

/* GET home page. */
router.get('/form', function(req, res, next) {
    res.render('form', { title: 'Form' });
});


/* GET home page. */
router.post('/sendMail', function(req, res, next) {

    let message = req.body.message;
    let emailTo = emailToSend;


    if (emailTo != null && message != null) {

        var mailOptions = {
            from: email,
            to: emailTo,
            subject: subject,
            text: message,
        };

        transporter.sendMail(mailOptions, function(error, info) {
            if (error)
                res.json(errorRes)
            else {
                res.json(sucessEmailRes)
            }
        });

        return res.json(sucessEmailRes);

    } else

        return res.json(errorRes);



});



router.post('/verifyOtp', function(req, res, next) {

    let otpNumber = req.body.code;
    if (!isNaN(otpNumber) && otpNumber.toString().length == inputQty) {
        try {
            let otpModel = {
                otp: otpNumber
            };

            otp.findOne(otpModel).exec(function(err, otpRes) {

                if (err)
                    return res.json(errorRes)

                if (otpRes != null && otpRes.used == false) {
                    otpRes.used = true;
                    otpRes.save();
                    return res.json({ "status": true });;

                }
                return res.json({ "status": false });;
            });
        } catch (err) {
            console.log(err)
            return res.json(errorRes);
        }
    } else

        return res.json(errorRes);
});


module.exports = router;