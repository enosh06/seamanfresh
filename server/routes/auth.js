const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken, isAdmin } = require('../middleware/auth');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.put('/change-password', verifyToken, authController.changePassword);
router.get('/users', verifyToken, isAdmin, authController.getAllUsers);

module.exports = router;
