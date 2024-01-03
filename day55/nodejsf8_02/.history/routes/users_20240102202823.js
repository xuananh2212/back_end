var express = require('express');
var router = express.Router();
const userController = require('../controllers/users.controllers');

/* GET users listing. */
router.get('/', userController.index);
router.get('/add', userController.add);
router.post('/add', userController.handleAdd);
router.get('/edit', userController.edit);
router.post('/edit/:id', userController.handleEdit);
module.exports = router;
