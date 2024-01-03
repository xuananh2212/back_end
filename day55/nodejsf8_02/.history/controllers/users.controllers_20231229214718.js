const userModel = require('../models/user.model');
const moment = require('moment');
module.exports = {
     index: async (req, res) => {
          const users = await userModel.all();
          console.log(users);
          res.render('users/index.ejs', { users, moment });
     }
}