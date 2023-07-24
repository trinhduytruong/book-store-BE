const express = require('express');
const router = express.Router();
const authz = require('../middlewares/authorization');

const titleController = require('../app/controllers/title.controller');

router.post('/create', authz.verifyAdmin, titleController.createTitle);
router.post('/update', authz.verifyAdmin, titleController.updateTitle);
router.post('/update-sold', authz.verifyAdmin, titleController.updateTitleSold);
router.get('/delete', authz.verifyAdmin, titleController.deleteTitle);
router.get('/detail/:slug', titleController.getTitle);
router.get('/user', titleController.getUserTitles);
router.post('/search', titleController.getUserSearchingTitles);
router.get('/slug/:id', titleController.getSlugByID);

router.get('/', titleController.getAllTitles);

module.exports = router;