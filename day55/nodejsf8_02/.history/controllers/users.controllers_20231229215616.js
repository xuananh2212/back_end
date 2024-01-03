const userModel = require('../models/user.model');
const moment = require('moment');
module.exports = {
     index: async (req, res) => {
          let { status } = req.query;
          if (status === 'active' || status === 'inactive') {
               status = status === 'active' ? true : false;
               console.log(status);
          }
          const users = await userModel.all();
          console.log(users);
          res.render('users/index.ejs', { users, moment });
     }
}