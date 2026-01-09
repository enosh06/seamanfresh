const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Public route to send message
router.post('/', messageController.createMessage);

// Admin routes
router.get('/', verifyToken, isAdmin, messageController.getMessages);
router.delete('/:id', verifyToken, isAdmin, messageController.deleteMessage);

module.exports = router;
