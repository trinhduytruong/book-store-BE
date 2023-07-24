const express = require('express');
const router = express.Router();
const authz = require('../middlewares/authorization');

const userController = require('../app/controllers/user.controller');

router.post('/login', userController.login);
router.post('/create', userController.create);

router.get('/profile', authz.verifyToken, userController.getProfile);
router.post('/update-profile', authz.verifyToken, userController.updateProfile);
router.post('/update-password', authz.verifyToken, userController.updatePassword);
router.get('/logout', authz.verifyToken, userController.logout);

router.get('/get-all-users', authz.verifyAdmin, userController.getAllUsers);
// router.get('/lock-user', authz.verifyAdmin, userController.lockUser);

module.exports = router;