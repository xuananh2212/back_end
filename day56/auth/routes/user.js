var express = require('express');
var router = express.Router();
const { User } = require('../models/index');
var userController = require('../controllers/user.controllers');


/* GET home page. */
router.get('/', userController.index);
router.post('/delete/:id', userController.handleDelete);
router.get('/role-permission/:id', userController.addRolePermission);
router.post('/role-permission/:id', userController.handleAddRolePermission);
module.exports = router;
