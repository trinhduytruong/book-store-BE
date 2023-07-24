const express = require('express');
const router = express.Router();
const authz = require('../middlewares/authorization');

const bookController = require('../app/controllers/book.controller');

router.post('/create', authz.verifyAdmin, bookController.createBook);
router.post('/update', authz.verifyAdmin, bookController.updateBook);
router.get('/delete', authz.verifyAdmin, bookController.deleteBook);
router.get('/get-all/:titleID', authz.verifyAdmin, bookController.getAllBooks);
router.get('/:id', authz.verifyAdmin, bookController.getBook);

module.exports = router;