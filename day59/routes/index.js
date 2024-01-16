var express = require('express');
var router = express.Router();
var emailController = require('../controllers/email.controllers');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.redirect('/email')
});
router.get('/check-read', emailController.handleReadEmail);
module.exports = router;
