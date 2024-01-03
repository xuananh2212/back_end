var express = require('express');
var router = express.Router();
const userController = require('../controllers/users.controllers');

/* GET users listing. */
router.get('/', userController.index);
router.get('/add', userController.add);
module.exports = router;
