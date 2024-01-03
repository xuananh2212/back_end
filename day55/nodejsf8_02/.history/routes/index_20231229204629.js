var express = require('express');
var router = express.Router();
const sql = require('../utils/db');


/* GET home page. */
router.get('/', async function (req, res, next) {
  try {
    const users = await sql`SELECT * FROM users`;
    console.log(users);

  } catch (err) {
    console.log(err.messages);
  }
  res.render('index', { title: 'Express' });
});

module.exports = router;
