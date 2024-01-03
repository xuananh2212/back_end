var createError = require('http-errors');
const userModel = require('../models/user.model');
const { object, string } = require('yup');
const moment = require('moment');
module.exports = {
     index: async (req, res) => {
          let { status, keyword } = req.query;
          const msg = req.flash('msg');
          let statusBool;
          if (status === 'active' || status === 'inactive') {
               statusBool = status === 'active' ? true : false;
          }
          const users = await userModel.all(statusBool, keyword);
          res.render('users/index', { users, moment, keyword, statusBool, msg });
     }
     ,
     add: async (req, res) => {
          res.render('users/add', { req });
     },
     handleAdd: async (req, res) => {
          const schema = object({
               name: string().required('Tên bắt buộc phải nhập'),
               email: string().required('Email bắt buộc phải nhập').email('email không đúng định dạng')
                    .test('unique', 'email đã tồn tại trên hệ thống', async (value) => {
                         return ! await userModel.checkEmail(value);
                    })
          })
          try {
               const body = await schema.validate(req.body, { abortEarly: false });
               body.status = body.status === '1' ? true : false;
               await userModel.insertUser(body);
               req.flash('msg', 'Thêm thành công');
               return res.redirect('users');

          } catch (e) {
               const errors = Object.fromEntries(e?.inner.map((item) => [item.path, item.message]));
               req.flash('errors', errors)
               req.flash('old', req.body);

               return res.redirect('users/add');
          }

     },
     edit: async (req, res, next) => {
          const { id } = req.params;
          const user = await userModel.inforUser(id);
          console.log(user.length);
          if (!user.length) {
               return next(createError(404));
          }
          const { name, email, status } = user[0];
          res.render('users/edit', { name, email, status, req });
     },
     handleEdit: async (req, res) => {
          const { id } = req.params;
          const schema = object({
               name: string().required('Tên bắt buộc phải nhập'),
               email: string().required('Email bắt buộc phải nhập').email('email không đúng định dạng')
                    .test('unique', 'email đã tồn tại trên hệ thống', async (value) => {
                         return ! await userModel.checkEmail(value);
                    })
          })
          try {
               const body = await schema.validate(req.body, { abortEarly: false });
               body.status = body.status === '1' ? true : false;
               await userModel.insertUser(body);
               req.flash('msg', 'Thêm thành công');
               return res.redirect('users');

          } catch (e) {
               const errors = Object.fromEntries(e?.inner.map((item) => [item.path, item.message]));
               req.flash('errors', errors)
               req.flash('old', req.body);

               return res.redirect(`users/edit/${id}`);
          }
     }
}