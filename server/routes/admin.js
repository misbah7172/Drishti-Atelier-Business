const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/admin');

// All admin routes require authentication + admin role
router.use(authenticateToken, requireAdmin);

// Dashboard stats
router.get('/dashboard', adminController.getDashboardStats);

module.exports = router;
