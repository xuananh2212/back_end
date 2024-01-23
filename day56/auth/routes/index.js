var express = require('express');
var router = express.Router();
const { User } = require('../models/index');


/* GET home page. */
router.get('/', async function (req, res, next) {
  const { user: { id } } = req;
  const user = await User.findOne({
    where: {
      id
    }
  })
  res.render('index', { user });
});

module.exports = router;
