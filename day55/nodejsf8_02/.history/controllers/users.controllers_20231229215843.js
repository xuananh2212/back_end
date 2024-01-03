const userModel = require('../models/user.model');
const moment = require('moment');
module.exports = {
     index: async (req, res) => {
          let { status } = req.query;
          let statusBool;
          if (status === 'active' || status === 'inactive') {
               statusBool = status === 'active' ? true : false;
               console.log(status);
          }
          const users = await userModel.all();
          res.render('users/index.ejs', { users, moment });
     }
}