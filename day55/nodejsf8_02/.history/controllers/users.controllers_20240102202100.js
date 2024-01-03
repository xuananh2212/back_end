const userModel = require('../models/user.model');
const { object, string, number, date, InferType } = require('yup');
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
          res.render('users/index.ejs', { users, moment, keyword, statusBool, msg });
     }
     ,
     add: async (req, res) => {
          res.render('users/add.ejs', { req });
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
               const insertStatus = await userModel.insertUser(body);
               req.flash('msg', 'Thêm thành công');
               return res.redirect('/users');

          } catch (e) {
               const errors = Object.fromEntries(e?.inner.map((item) => [item.path, item.message]));
               req.flash('errors', errors)
               req.flash('old', req.body);

               return res.redirect('/users/add');
          }

     },
     edit: (req, res) => {
          res.render('/users/edit.ejs');
     },
     handleEdit: (req, res) => {
          res.send("hello");
     }
}