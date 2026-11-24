const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

// Public auth routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

// Social & Firebase auth routes
router.post('/firebase', authController.firebaseAuth);
router.post('/google', authController.googleAuth);
router.get('/google/url', authController.getGoogleAuthUrl);
router.get('/google/callback', authController.handleGoogleRedirect);

// Protected routes
router.get('/me', authenticateToken, authController.getMe);
router.put('/profile', authenticateToken, authController.updateProfile);
router.put('/password', authenticateToken, authController.changePassword);

module.exports = router;

