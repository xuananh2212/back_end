var express = require('express');
var router = express.Router();
const sql = require('../utils/db');
console.log(db);

/* GET home page. */
router.get('/', async function (req, res, next) {
  const users = await sql`SELECT * FROM users`;
  console.log(users);

  res.render('index', { title: 'Express' });
});

module.exports = router;
