const express = require('express');
const router = express.Router();
const { sendMessage, getMessages, getConversations, getAlumni, getUnreadCount } = require('../controllers/messageController');
const auth = require('../middleware/auth');

// Get all alumni
router.get('/alumni', auth, getAlumni);

// Get all conversations
router.get('/conversations', auth, getConversations);

// Get messages between two users
router.get('/:userId', auth, getMessages);

// Send a message
router.post('/', auth, sendMessage);

// Get unread count
router.get('/unread/count', auth, getUnreadCount);

module.exports = router;