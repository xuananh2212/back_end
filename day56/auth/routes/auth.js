var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const UAParser = require('ua-parser-js');
var authController = require('../controllers/auth.controllers');
var authMiddleWare = require('../middlewares/auth.middewares');
var { UserDevice, Device } = require('../models/index');

var passport = require('passport');
router.get('/dang-nhap', authMiddleWare.loginAndRegister, authController.index);
router.post('/dang-nhap', authController.handleLogin);

router.get('/dang-ki', authMiddleWare.loginAndRegister, authController.register);
router.post('/dang-ki', authController.handleRegister);

router.post('/dang-xuat', authMiddleWare.handleLogOut, authController.logOut);

router.get('/reset-password', authMiddleWare.loginAndRegister, authController.forgotPassword);
router.post('/reset-password', authController.handleForgotPassword);

router.get('/reset-password/:token', authController.newPassword);
router.post('/reset-password/:token', authController.handleNewPassword);

router.get('/google/redirect', passport.authenticate('google'));
router.get('/google/callback',
     passport.authenticate('google', {
          failureRedirect: '/auth/dang-nhap',

     }), async (req, res) => {
          const { user } = req;
          if (user?.status === 1) {
               const accessToken = jwt.sign({
                    id: user.id,
                    isAdmin: user.isAdmin,
                    email: user.email
               }, process.env.JWT_ACCESS_KEY, {
                    expiresIn: '1h'
               })
               const refreshToken = jwt.sign({
                    id: user.id,
                    isAdmin: user.isAdmin,
                    email: user.email
               }, process.env.JWT_REFRESH_KEY, {
                    expiresIn: '1h'
               })
               res.setHeader("Set-Cookie", [`access_token=${accessToken};path=/;HttpOnly;`,
               `refresh_token = ${refreshToken}; path =/;HttpOnly`]);
               const userAgent = req.headers['user-agent'];
               const parser = new UAParser(userAgent);
               const browser = parser.getBrowser();
               const os = parser.getOS();
               const deviceFind = await Device.findOne({
                    where: {
                         desc: userAgent
                    }
               })
               const userDevice = await UserDevice.findOne({
                    where: {
                         userId: user.id
                    }
               })
               if (!deviceFind) {
                    const device = await Device.create({
                         browser: browser.name,
                         os: os.name,
                         desc: userAgent
                    });
                    await user.addDevice(device,
                         {
                              through: {
                                   logOut: false
                              }
                         }
                    );
               } else {
                    if (!userDevice) {
                         await user.addDevice(deviceFind,
                              {
                                   through: {
                                        logOut: false
                                   }
                              }
                         );
                    } else {
                         await UserDevice.update({
                              logOut: false
                         }, {
                              where: {
                                   deviceId: deviceFind.id,
                                   userId: user.id,
                              }
                         })

                    }


               }
          } else {
               req.flash('msgError', 'Tài khoản chưa kích hoạt');
               return res.redirect('/auth/dang-nhap')
          }

          return res.redirect('/');
     }
);
module.exports = router;