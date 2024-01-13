const model = require("../models/index");
const { Op } = require("sequelize");
const { object, string } = require('yup');
const bcrypt = require('bcrypt');
const User = model.User;
const UserDevice = model.UserDevice;

module.exports = {
     infor: async (req, res) => {
          const { id } = req.user;
          const msg = req.flash('msg');
          let user = null;
          try {
               user = await User.findByPk(id);
          } catch (err) {
               console.log(err);
          }
          return res.render('profile/infor.ejs', { user, req, msg })

     },
     handleInfor: async (req, res) => {
          const { id: currentId } = req.user;
          console.log(req.body);
          try {
               const schema = object({
                    name: string()
                         .required('vui lòng nhập name')
                    ,
                    email: string()
                         .required('vui lòng nhập email')
                         .email("không đúng định dạng email")
                         .test(
                              'unique',
                              'email đã trùng mới tài khoản khác trên hệ thống',
                              async (value) => {
                                   const user = await User.findOne({
                                        where: {
                                             email: value,
                                             id: {
                                                  [Op.ne]: +currentId
                                             }
                                        }
                                   })
                                   return user ? false : true;
                              }
                         )
               })
               const body = await schema.validate(req.body, { abortEarly: false });
               body.status = +body.status;
               await User.update(body, {
                    where: {
                         id: currentId
                    }
               });
               if (body.status === 0) {
                    req.flash('msg', 'cập nhập thành công! bạn bị đã khoá tài khoản');
                    res.clearCookie('refresh_token');
                    res.clearCookie('access_token');
                    res.redirect('/dang-nhap');
                    return

               }
               req.flash('msg', 'Cập nhập thành công');

          } catch (err) {
               console.log(err);
               const errors = Object.fromEntries(err?.inner.map(({ path, message }) => [path, message]));
               req.flash('errors', errors);
          }


          return res.redirect('/profile/basic-information');

     },
     changePassword: (req, res) => {
          res.render('profile/changePassword.ejs', { req })
     },
     handleChangePassword: async (req, res) => {
          const { id: currentId } = req.user;
          const user = await User.findByPk(currentId);
          console.log(user);
          try {
               const schema = object({
                    passwordOld: string()
                         .required('vui lòng nhập password')
                         .matches(/.{8,}$/, "mật khẩu ít nhất 8 kí tự")
                         .test("password", "mật khẩu cũ không chính xác", async (value) => {
                              return await bcrypt.compare(value, user?.password);
                         })
                    ,
                    passwordNew: string()
                         .required('vui lòng nhập password')
                         .matches(/.{8,}$/, "mật khẩu ít nhất 8 kí tự")
                         .test("passwordNew", "mật khẩu mới không khớp nhau",
                              (value) => {
                                   return value === req.body?.passwordNewR
                              })
                         .test("passwordNeww", "mật khẩu mới trùng với mật khẩu cũ", (value) => {
                              return value !== req.body?.passwordOld
                         })
                    ,
                    passwordNewR: string()
                         .required('vui lòng nhập password')
                         .matches(/.{8,}$/, "mật khẩu ít nhất 8 kí tự")
                         .test("passwordNewR", "mật khẩu mới không khớp nhau",
                              (value) => {
                                   return value === req.body?.passwordNew
                              })
                         .test("paswordNewRR", "mật khẩu mới trùng với mật khẩu cũ", (value) => {
                              return value !== req.body?.passwordOld
                         })
               })
               const body = await schema.validate(req.body, { abortEarly: false });
               const salt = await bcrypt.genSalt(10);
               const hashed = await bcrypt.hash(body.passwordNew, salt);
               await User.update({
                    password: hashed
               }, {
                    where: {
                         id: currentId
                    }
               });
               await UserDevice.update({
                    logOut: true
               }, {
                    where: {
                         userId: currentId
                    }
               })
               req.flash('msg', 'đổi mật khẩu thành công Vui lòng đăng nhập lại');
               res.clearCookie('refresh_token');
               res.clearCookie('access_token');
               return res.redirect('/dang-nhap');
          } catch (err) {
               console.log(err);
               const errors = Object.fromEntries(err?.inner.map(({ path, message }) => [path, message]));
               req.flash('errors', errors);
          }
          return res.redirect('/profile/change-password');
     }
}