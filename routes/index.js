var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var auth = jwt({
  secret: 'MY_SECRET',
  userProperty: 'payload'
});

var ctrlProfile = require('../api/controllers/profile');
var ctrlAuth = require('../api/controllers/authentication');

// profile
router.get('/profile', auth, ctrlProfile.profileRead);

// authentication
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

router.post('/forgotpwd', ctrlAuth.forgotPassword);
router.post('/resetpwd', ctrlAuth.resetPassword);

module.exports = router;
