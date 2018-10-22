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
router.put('/profile', auth, ctrlProfile.profileUpdate);

// authentication
router.post('/registerID/0a6O85y4h5cVsBfRB-57n4l4DBN6WmMlA2f94I_oaNs', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

// password reset
// router.get('/resetpwd', ctrlAuth.resetPassword);

router.post('/forgotpwd', ctrlAuth.forgotPassword);
router.post('/resetpwd', ctrlAuth.resetPassword);

module.exports = router;
