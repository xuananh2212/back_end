var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var authController = require('../controllers/auth.controllers');
var authMiddleWare = require('../middlewares/auth.middewares')
router.get('/dang-nhap', authMiddleWare.loginAndRegister, authController.index);
router.post('/dang-nhap', authController.handleLogin);
router.get('/dang-ki', authMiddleWare.loginAndRegister, authController.register);
router.post('/dang-ki', authController.handleRegister);
router.post('/dang-xuat', authController.logOut)
module.exports = router;