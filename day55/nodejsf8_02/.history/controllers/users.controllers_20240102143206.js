const userModel = require('../models/user.model');
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
          res.render('users/index.ejs', { users, moment, keyword, statusBool: status });
     }
}