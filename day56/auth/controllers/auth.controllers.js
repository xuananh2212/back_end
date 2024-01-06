var model = require('../models/index');
const { object, string } = require('yup');
const jwt = require('jsonwebtoken');
const User = model.User;
const bcrypt = require('bcrypt');

module.exports = {
     index: (req, res) => {
          const msg = req.flash('msg');
          const msgError = req.flash('msgError');
          res.render('auth/index.ejs', { msg, req, msgError });
     },
     handleLogin: async (req, res) => {
          const { email, password } = req.body;
          console.log(password);
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
               const user = await User.findAll({
                    where: {
                         email: body.email
                    }
               })
               if (!user.length) {
                    req.flash('msgError', 'Thông tin tài khẩu và mật khẩu không chính xác!');
                    return res.redirect('/dang-nhap')
               }
               const validPassword = await bcrypt.compare(body.password, user[0].password);
               if (!validPassword) {
                    req.flash('msgError', 'Thông tin tài khẩu và mật khẩu không chính xác!');
                    return res.redirect('/dang-nhap')
               } else {
                    console.log(user[0], user[0].id, user[0].email, user[0].isAdmin);
                    const accessToken = jwt.sign({
                         id: user[0].id,
                         isAdmin: user[0].isAdmin,
                         email: user[0].email
                    }, process.env.JWT_ACCESS_KEY, {
                         expiresIn: '1h'
                    })
                    const reffreshToken = jwt.sign({
                         id: user[0].id,
                         isAdmin: user[0].isAdmin,
                         email: user[0].email
                    }, process.env.JWT_ACCESS_KEY, {
                         expiresIn: '1h'
                    })
                    res.setHeader("Set-Cookie", [`access_token=${accessToken};path=/;HttpOnly;`,
                    `reffresh_token = ${reffreshToken}; path =/;HttpOnly`]);
               }

               return res.redirect('/');
          } catch (e) {
               console.log(e);
               const errors = Object.fromEntries(e?.inner?.map((item) => [item.path, item.message]));
               req.flash('errors', errors);
               req.flash('old', req.body);
               return res.redirect('/dang-nhap');
          }

     },
     register: async (req, res) => {
          console.log(1111);
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
                              const users = await User.findAll({
                                   where: {
                                        email: value
                                   }
                              });
                              console.log(users, 1111);
                              return users.length ? false : true;

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
     logOut: (req, res) => {
          res.clearCookie('reffesh_token');
          res.clearCookie('access_token');
          return res.redirect('/dang-nhap');
     }
}