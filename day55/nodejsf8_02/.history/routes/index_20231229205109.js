var express = require('express');
var router = express.Router();
const sql = require('../utils/db');


/* GET home page. */
router.get('/', async function (req, res, next) {
  try {
    const users = await sql`SELECT * FROM users`;
    console.log(users);

  } catch (err) {
    if (e.errors[0].message) {
      console.log(e.errors[0].message);

    } else {
      console.log(err.message);
    }
  }
  res.render('index', { title: 'Express' });
});

module.exports = router;
