const express = require('express');
const router = express.Router();
const siteController = require('../app/controllers/site.controller');
const authz = require('../middlewares/authorization');

// const siteController = require('../app/controllers/site.controller');

// router.get('/search', siteController.search);
// router.get('/refresh-token', authz.verifyRefreshToken, siteController.refreshToken);
// router.get('/home', siteController.index);
// router.get('/', siteController.index);

module.exports = router;