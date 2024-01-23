var express = require('express');
var router = express.Router();
const { User } = require('../models/index');
var userController = require('../controllers/user.controllers');


/* GET home page. */
router.get('/', userController.index);
module.exports = router;
