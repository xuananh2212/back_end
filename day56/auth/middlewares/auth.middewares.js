const jwt = require('jsonwebtoken');
const model = require("../models/index");
const UserDevice = model.UserDevice;
const Device = model.Device;
const authMiddleWare = {
     handlReffeshToken: (refresh_token, req, res, next) => {
          if (!refresh_token) {
               return res.redirect('/auth/dang-nhap');
          } else {
               jwt.verify(refresh_token, process.env.JWT_REFRESH_KEY, (err, user) => {
                    if (err) {
                         console.log('loi');
                         return res.redirect('/auth/dang-nhap');
                    } else {
                         const accessToken = jwt.sign({
                              id: user.id,
                              isAdmin: user.isAdmin,
                         }, process.env.JWT_ACCESS_KEY, {
                              expiresIn: '1h'
                         })
                         const refreshToken = jwt.sign({
                              id: user.id,
                              isAdmin: user.isAdmin,
                         }, process.env.JWT_REFRESH_KEY, {
                              expiresIn: '1h'
                         })
                         req.user = user;
                         res.setHeader("Set-Cookie", [`access_token=${accessToken};path=/;HttpOnly;`,
                         `refresh_token = ${refreshToken}; path =/;HttpOnly`]);
                         next();
                    }

               });

          }
     },
     index: async (req, res, next) => {
          const access_token = req.cookies.access_token;
          const refresh_token = req.cookies.refresh_token;
          if (access_token) {
               jwt.verify(access_token, process.env.JWT_ACCESS_KEY, async (err, user) => {
                    if (err) {
                         authMiddleWare.handlReffeshToken(refresh_token, req, res, next);
                    } else {
                         req.user = user;
                         const userAgent = req.headers['user-agent'];
                         try {
                              const deviceFind = await Device.findOne({
                                   where: {
                                        desc: userAgent
                                   }
                              })
                              const userDevice = await UserDevice.findOne({
                                   where: {
                                        deviceId: deviceFind?.id,
                                        userId: user?.id,
                                   }
                              })
                              if (userDevice?.logOut) {
                                   res.clearCookie('refresh_token');
                                   res.clearCookie('access_token');
                                   return res.redirect('/auth/dang-nhap');
                              } else {
                                   next();
                              }

                         } catch (err) {
                              console.log(err);
                         }
                    }
               })
          } else {
               authMiddleWare.handlReffeshToken(refresh_token, req, res, next);

          }
     },
     loginAndRegister: async (req, res, next) => {
          const token = req.cookies.access_token;
          if (token) {
               jwt.verify(token, process.env.JWT_ACCESS_KEY, (err, user) => {
                    if (!err) {
                         return res.redirect('/');
                    } else {
                         next();
                    }
               })
          } else {
               next();
          }

     },
     handleLogOut: async (req, res, next) => {
          const token = req.cookies.access_token;
          if (token) {
               jwt.verify(token, process.env.JWT_ACCESS_KEY, (err, user) => {
                    if (!err) {
                         req.user = user;
                         next();
                    } else {
                         return res.redirect('/auth/dang-nhap')
                    }
               })
          } else {
               return res.redirect('/auth/dang-nhap')
          }

     }

}
module.exports = authMiddleWare;