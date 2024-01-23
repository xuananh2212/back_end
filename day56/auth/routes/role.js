var express = require('express');
var router = express.Router();
var roleControllers = require('../controllers/role.controllers');


/* GET home page. */
router.get('/', roleControllers.index);
router.get('/add', roleControllers.addRole);
router.post('/add', roleControllers.handleAddRole);
router.get('/edit/:id', roleControllers.editRole);
router.post('/edit/:id', roleControllers.handleEditRole);
router.post('/delete/:id', roleControllers.handleDeleteRole);
module.exports = router;
