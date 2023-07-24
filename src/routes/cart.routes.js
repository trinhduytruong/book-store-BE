const express = require('express');
const router = express.Router();
const authz = require('../middlewares/authorization');

const cartController = require('../app/controllers/cart.controller');

router.post('/add', authz.verifyToken, cartController.addToCart);
router.post('/update', authz.verifyToken, cartController.updateCart)
router.get('/delete', authz.verifyToken, cartController.deleteFromCart);
router.get('/check-all', authz.verifyToken, cartController.checkAll);
router.get('/', authz.verifyToken, cartController.getCart);

module.exports = router;