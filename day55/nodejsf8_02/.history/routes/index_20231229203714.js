var express = require('express');
var router = express.Router();
const db = require('../utils/db');
console.log(db);

/* GET home page. */
router.get('/', async function (req, res, next) {
  const users = await db`SELECT * FROM users`;

  res.render('index', { title: 'Express' });
});

module.exports = router;
