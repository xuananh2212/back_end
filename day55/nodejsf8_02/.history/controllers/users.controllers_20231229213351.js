const userModel = require('../models/user.model');
module.exports = {
     index: async (req, res) => {
          const users = await userModel.all();
          console.log(users);
          res.render('users/index.ejs');
     }
}