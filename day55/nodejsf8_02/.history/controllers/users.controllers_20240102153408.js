const userModel = require('../models/user.model');
const { object, string, number, date, InferType } = require('yup');
console.log(object, string);
const moment = require('moment');
module.exports = {
     index: async (req, res) => {
          let { status, keyword } = req.query;
          let statusBool;
          console.log(keyword);
          if (status === 'active' || status === 'inactive') {
               statusBool = status === 'active' ? true : false;
          }
          const users = await userModel.all(statusBool, keyword);
          res.render('users/index.ejs', { users, moment, keyword, statusBool });
     }
     ,
     add: (req, res) => {
          console.log(req.flash('errors'));
          res.render('users/add.ejs');
     },
     handleAdd: async (req, res) => {
          const { name, email, status } = req.body;
          const schema = object({
               name: string().required('Tên bắt buộc phải nhập'),
               email: string().required('Email bắt buộc phải nhập').email('email không đúng định dạng'),
          })
          try {
               const body = await schema.validate(req.body, { abortEarly: true });
               //abortearly : trả về tất cả các errors.

          } catch (e) {
               const errors = Object.fromEntries(e.inner.map((item) => [item.path, item.message]));
               req.flash('errors', errors)

          }

          return res.redirect('/users/add');
     }
}