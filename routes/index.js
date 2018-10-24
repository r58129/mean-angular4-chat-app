var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var auth = jwt({
  secret: global.mySecret,
  userProperty: 'payload'
});

var ctrlProfile = require('../api/controllers/profile');
var ctrlAuth = require('../api/controllers/authentication');

// profile
router.get('/profile', auth, ctrlProfile.profileRead);
router.put('/profile', auth, ctrlProfile.profileUpdate);

// authentication
router.post(process.env.CS_REG_PATH, ctrlAuth.register);
router.post('/login', ctrlAuth.login);

// password reset
// router.get('/resetpwd', ctrlAuth.resetPassword);

router.post('/forgotpwd', ctrlAuth.forgotPassword);
router.post('/resetpwd', ctrlAuth.resetPassword);

module.exports = router;
