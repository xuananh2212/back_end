const userModel = require('../models/user.model');
const { object, string, number, date, InferType } = require('yup');
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
          res.render('users/add.ejs');
     },
     handleAdd: (req, res) => {
          const { name, email, status } = req.body;
          console.log(name, email, status);

          res.end("success");
     }
}