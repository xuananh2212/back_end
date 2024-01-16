var router = require('express').Router();
var emailController = require('../controllers/email.controllers');
router.get('/', emailController.sendEmail);
router.post('/', emailController.handleSendEmail);
router.get('/history', emailController.historyAll);
router.get('/history/:id', emailController.historyDetail);
module.exports = router;