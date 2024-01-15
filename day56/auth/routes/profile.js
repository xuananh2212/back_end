var router = require('express').Router();
var profileController = require('../controllers/profile.controllers');

router.get('/basic-information', profileController.infor);
router.post('/basic-information', profileController.handleInfor);
router.get('/change-password', profileController.changePassword);
router.get('/devices', profileController.devices);
router.post('/devices/:id', profileController.handleDeviceLogOut);
router.post('/change-password', profileController.handleChangePassword);
module.exports = router;