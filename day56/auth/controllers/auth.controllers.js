var model = require('../models/index');
const { object, string } = require('yup');
const jwt = require('jsonwebtoken');
const UAParser = require('ua-parser-js');
const bcrypt = require('bcrypt');
const { User, Device, UserDevice, BlackList } = model;

const { Op } = require("sequelize");
const sendMail = require('../utils/mailer');
module.exports = {
     index: (req, res) => {
          const msg = req.flash('msg');
          const msgError = req.flash('msgError');
          res.render('auth/index.ejs', { msg, req, msgError, layout: 'auth/layout.ejs' });
     },
     handleLogin: async (req, res) => {
          try {
               let schema = object({
                    password:
                         string()
                              .required("vui lòng nhập tên")
                              .matches(/.{8,}$/, "mật khẩu ít nhất 8 kí tự"),
                    email:
                         string()
                              .required("vui lòng nhập email")
                              .email("email không đúng định dang")
               });
               const body = await schema.validate(req.body, { abortEarly: false });
               const user = await User.findOne({
                    where: {
                         email: body.email,
                         providerId: {
                              [Op.is]: null,
                         }

                    },
                    include: Device
               })

               if (!user) {
                    req.flash('msgError', 'Thông tin tài khẩu và mật khẩu không chính xác!');
                    return res.redirect('/auth/dang-nhap')
               }
               const validPassword = bcrypt.compareSync(body.password, user.password);
               if (!validPassword) {
                    req.flash('msgError', 'Thông tin tài khẩu và mật khẩu không chính xác!');
                    return res.redirect('/auth/dang-nhap')
               } else {
                    if (user.status === 1) {
                         const accessToken = jwt.sign({
                              id: user.id,
                              email: user.email
                         }, process.env.JWT_ACCESS_KEY, {
                              expiresIn: '1h'
                         })
                         const refreshToken = jwt.sign({
                              id: user.id,
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
                         // console.log(userDevice);
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

               }
               return res.redirect('/');
          } catch (e) {
               // console.log(e);
               const errors = Object.fromEntries(e?.inner?.map((item) => [item.path, item.message]));
               req.flash('errors', errors);
               req.flash('old', req.body);
               return res.redirect('/auth/dang-nhap');
          }
     },
     register: async (req, res) => {
          res.render('auth/register.ejs', { req, layout: 'auth/layout.ejs' });
     },
     handleRegister: async (req, res) => {
          const { password, passwordRe } = req.body;
          try {
               let schema = object({
                    name: string().required("vui lòng nhập tên"),
                    email: string().required("vui lòng nhập email")
                         .email("email không đúng định dang")
                         .test('unique', 'email đang tồn tại!', async (value) => {
                              const user = await User.findOne({
                                   where: {
                                        email: value,
                                        providerId: null
                                   }
                              });
                              return user ? false : true;

                         }),
                    password: string()
                         .required("vui lòng nhập mật khẩu")
                         .matches(/.{8,}$/, "mật khẩu ít nhất 8 kí tự")
                         .test("mk", "mật khẩu không khớp!", (values) => {
                              return values === passwordRe
                         })
               });
               const body = await schema.validate(req.body, { abortEarly: false });
               const salt = await bcrypt.genSalt(10);
               const hashed = await bcrypt.hash(password, salt);
               await User.create({
                    name: body.name,
                    email: body.email,
                    password: hashed
               });
               req.flash('msg', 'đăng kí thành công')
               return res.redirect('/auth/dang-nhap');
          } catch (e) {

               const errors = Object.fromEntries(e?.inner?.map((item) => [item.path, item.message]));
               req.flash('errors', errors);
               req.flash('old', req.body);
               return res.redirect('/auth/dang-ki');
          }



     },
     logOut: async (req, res) => {
          const { id } = req.user;
          const userAgent = req.headers['user-agent'];
          try {
               const deviceFind = await Device.findOne({
                    where: {
                         desc: userAgent
                    }
               })
               await UserDevice.update({
                    logOut: true
               }, {
                    where: {
                         deviceId: deviceFind.id,
                         userId: id,
                    }
               })

          } catch (err) {
          }


          res.clearCookie('refresh_token');
          res.clearCookie('access_token');
          return res.redirect('/auth/dang-nhap');
     },
     forgotPassword: (req, res) => {
          const msg = req.flash('msg');
          const error = req.flash('error');
          const msgError = req.flash("msgError");
          res.render('auth/forgotPassword', { req, error, msg, msgError });
     }
     ,
     handleForgotPassword: async (req, res) => {
          try {
               let schema = object({
                    email: string().required("vui lòng nhập email")
                         .email("email không đúng định dang")
                         .test('unique', 'email không tồn tại!', async (value) => {
                              const user = await User.findOne({
                                   where: {
                                        email: value,
                                        providerId: {
                                             [Op.is]: null,
                                        }
                                   }
                              });
                              return user ? true : false;

                         }),

               });
               const body = await schema.validate(req.body, { abortEarly: false });
               const expirationTime = Math.floor(Date.now() / 1000) + 15 * 60;
               let token = jwt.sign({ email: body?.email }, process.env.JWT_ACCESS_KEY, { expiresIn: expirationTime });
               token = token.replaceAll('.', '*');
               //http://localhost:3000
               //https://auth-two-nu.vercel.app
               const html = `<a href="https://auth-two-nu.vercel.app/auth/reset-password/${token}">verify password</a>`
               await sendMail(body?.email, "verify password", html);
               req.flash('msg', "vui lòng Kiểm tra email để đổi password");
          } catch (err) {
               // console.log(err);
               if (err?.inner?.length) {
                    const error = err?.inner[0]?.message;
                    req.flash('error', error);
               }
          }
          return res.redirect('/auth/reset-password');

     },
     newPassword: async (req, res, next) => {
          let { token } = req.params;
          token = token.replaceAll('*', '.');
          // console.log(token);
          const blackList = await BlackList.findOne({
               where: {
                    token
               }
          })
          if (blackList) {
               return next(new Error("url không tồn tại"));
          } else {
               jwt.verify(token, process.env.JWT_ACCESS_KEY, async (err, data) => {
                    if (err) {

                         return next(new Error("url hết hạn"));
                    } else {

                         res.render('auth/newPassword', { req });
                    }
               });

          }


     },
     handleNewPassword: async (req, res) => {
          let { token } = req.params;

          token = token.replaceAll('*', '.');
          jwt.verify(token, process.env.JWT_ACCESS_KEY, async (err, data) => {
               if (err) {

                    req.flash("msgError", "lỗi không thể đổi mật khẩu");
                    return res.redirect('/auth/reset-password');
               } else {

                    const { email } = data;
                    try {
                         const schema = object({
                              passwordNew: string()
                                   .required('vui lòng nhập password')
                                   .matches(/.{8,}$/, "mật khẩu ít nhất 8 kí tự")
                                   .test("passwordNew", "mật khẩu mới không khớp nhau",
                                        (value) => {
                                             return value === req.body?.passwordNewR
                                        })
                              ,
                              passwordNewR: string()
                                   .required('vui lòng nhập password')
                                   .matches(/.{8,}$/, "mật khẩu ít nhất 8 kí tự")
                                   .test("passwordNewR", "mật khẩu mới không khớp nhau",
                                        (value) => {
                                             return value === req.body?.passwordNew
                                        })
                         })
                         const body = await schema.validate(req.body, { abortEarly: false });
                         const salt = await bcrypt.genSalt(10);
                         const hashed = await bcrypt.hash(body.passwordNew, salt);
                         await User.update({
                              password: hashed
                         }, {
                              where: {
                                   email,
                                   providerId: {
                                        [Op.is]: null,
                                   }

                              }
                         });
                         await BlackList.findOrCreate({
                              where: {
                                   token
                              },
                              defaults: {
                                   token
                              }
                         })
                         req.flash('msg', 'đổi mật khẩu thành công Vui lòng đăng nhập lại');
                         return res.redirect('/auth/dang-nhap');
                    } catch (err) {
                         token = token.replaceAll('.', '*');
                         const errors = Object.fromEntries(err?.inner.map(({ path, message }) => [path, message]));
                         req.flash('errors', errors);
                         return res.redirect(`/auth/reset-password/${token}`);
                    }

               }

          })


     }
}