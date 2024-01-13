var model = require('../models/index');
const { object, string } = require('yup');
const jwt = require('jsonwebtoken');
const UAParser = require('ua-parser-js');
const bcrypt = require('bcrypt');
const User = model.User;
const Device = model.Device;
const UserDevice = model.UserDevice;

module.exports = {
     index: (req, res) => {
          const msg = req.flash('msg');
          const msgError = req.flash('msgError');
          res.render('auth/index.ejs', { msg, req, msgError });
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
                         email: body.email
                    },
                    include: Device
               })

               if (!user) {
                    req.flash('msgError', 'Thông tin tài khẩu và mật khẩu không chính xác!');
                    return res.redirect('/dang-nhap')
               }
               const validPassword = await bcrypt.compare(body.password, user.password);
               if (!validPassword) {
                    req.flash('msgError', 'Thông tin tài khẩu và mật khẩu không chính xác!');
                    return res.redirect('/dang-nhap')
               } else {
                    if (user.status === 1) {
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
                              await UserDevice.update({
                                   logOut: false
                              }, {
                                   where: {
                                        deviceId: deviceFind.id,
                                        userId: user.id,
                                   }
                              })

                         }
                    } else {
                         req.flash('msgError', 'Tài khoản chưa kích hoạt');
                         return res.redirect('/dang-nhap')
                    }

               }

               return res.redirect('/');
          } catch (e) {
               const errors = Object.fromEntries(e?.inner?.map((item) => [item.path, item.message]));
               req.flash('errors', errors);
               req.flash('old', req.body);
               return res.redirect('/dang-nhap');
          }

     },
     register: async (req, res) => {
          res.render('auth/register.ejs', { req });
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
                                        email: value
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
               return res.redirect('/dang-nhap');
          } catch (e) {

               const errors = Object.fromEntries(e?.inner?.map((item) => [item.path, item.message]));
               req.flash('errors', errors);
               req.flash('old', req.body);
               return res.redirect('/dang-ki');
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
               console.log(err);
          }


          res.clearCookie('refresh_token');
          res.clearCookie('access_token');
          return res.redirect('/dang-nhap');
     }
}