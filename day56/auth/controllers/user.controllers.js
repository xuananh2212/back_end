const { User } = require('../models/index');
module.exports = {
     index: async (req, res, next) => {
          const { user: { id } } = req;
          const users = await User.findAll();
          const page = 0;
          const totalPage = 0;
          res.render('users/index', { users, page, totalPage });
     }
}