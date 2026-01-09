const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Admin routes
router.get('/', verifyToken, isAdmin, orderController.getAllOrders);
router.get('/analytics', verifyToken, isAdmin, orderController.getAnalytics); // Moved up
router.put('/:id/status', verifyToken, isAdmin, orderController.updateOrderStatus);
router.delete('/', verifyToken, isAdmin, orderController.deleteAllOrders);

// User routes - Specific routes must come before parameterized routes
router.post('/', verifyToken, orderController.createOrder);
router.get('/my-orders', verifyToken, orderController.getUserOrders);
router.get('/:id', verifyToken, orderController.getOrderDetails);

module.exports = router;
