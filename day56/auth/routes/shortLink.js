var router = require('express').Router();
var shortLinkController = require("../controllers/shortLink.controllers");
router.get('/', shortLinkController.index);
router.post('/', shortLinkController.handleAddShortLink);
router.get('/:id', shortLinkController.redirectShortLink);
router.post('/:id', shortLinkController.handleRedirectShortLink);
module.exports = router;