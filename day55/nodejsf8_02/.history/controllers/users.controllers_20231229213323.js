const userModel = require('../models/user.model');
module.exports = {
     index: (req, res) => {

          res.render('users/index.ejs');
     }
}