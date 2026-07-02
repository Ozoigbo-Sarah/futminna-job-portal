const express = require('express');
const router = express.Router();
const { register, login, getMe, switchRole, addRole, updateProfile } = require('../controllers/authController');
const auth = require('../middleware/auth');

// Register
router.post('/register', register);

// Login
router.post('/login', login);

// Get current user
router.get('/me', auth, getMe);

// Switch active role
router.post('/switch-role', auth, switchRole);

// Add a new role
// Add a new role
router.post('/add-role', auth, addRole);

// Update profile
router.put('/profile', auth, updateProfile);

module.exports = router;