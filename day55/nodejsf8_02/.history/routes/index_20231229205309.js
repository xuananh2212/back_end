var express = require('express');
var router = express.Router();
const sql = require('../utils/db');


/* GET home page. */
router.get('/', async function (req, res, next) {
  try {
    const users = await sql`SELECT * FRO users`;
    console.log(users);

  } catch (e) {
    console.log(e);
    if (e.errors && e.errors[0].message) {
      console.log(e.errors[0].message);

    } else {
      console.log(e.message);
    }
  }
  res.render('index', { title: 'Express' });
});

module.exports = router;
