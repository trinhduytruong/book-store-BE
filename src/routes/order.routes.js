const express = require('express');
const router = express.Router();
const authz = require('../middlewares/authorization');

const orderController = require('../app/controllers/order.controller');
const Order = require('../app/models/order.model');

router.post('/create', authz.verifyToken, orderController.createOrder);
router.post('/order-checkout', authz.verifyToken, orderController.checkoutOrder);
router.post('/update', authz.verifyAdmin, orderController.updateOrder);
router.get('/get-all', authz.verifyAdmin, orderController.getAllOrders);
router.get('/detail/:id', authz.verifyAdmin, orderController.getOrderForAdmin);

router.get('/my-orders', authz.verifyToken, orderController.getAllMyOrders);
router.get('/my-orders/detail/:id', authz.verifyToken, orderController.getOrder);

router.get('/num-of-types', authz.verifyToken, orderController.getNumberOfOrderTypes);

// router.get('/delete-all', authz.verifyAdmin, async (req, res) => {
//     await Order.remove({});
//     return res.json('done');
// })

module.exports = router;