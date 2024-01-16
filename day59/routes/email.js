var router = require('express').Router();
var emailController = require('../controllers/email.controllers');
router.get('/', emailController.sendEmail);
router.post('/', emailController.handleSendEmail);
router.get('/history', emailController.historyAll);
router.get('/history/:id', emailController.historyDetail);
router.get('/tracking-pixel.png', emailController.handleReadEmail);
module.exports = router;