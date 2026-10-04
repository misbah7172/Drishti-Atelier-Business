const express = require('express');
const router = express.Router();
const admin = require('../controllers/adminController');
const cat = require('../controllers/categoryController');
const prod = require('../controllers/productController');
const upload = require('../middleware/upload');
const { authenticateToken } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/admin');

router.use(authenticateToken, requireAdmin);

router.get('/dashboard', admin.getDashboardStats);
router.get('/users', admin.getUsers);
router.put('/users/:id/status', admin.toggleUserStatus);
router.get('/orders', admin.getOrders);
router.put('/orders/:id/status', admin.updateOrderStatus);
router.get('/products', prod.getProducts);
router.post('/products', prod.createProduct);
router.put('/products/:id', prod.updateProduct);
router.delete('/products/:id', prod.deleteProduct);
router.post('/products/:id/images', upload.array('images', 6), prod.uploadProductImages);
router.delete('/products/:id/images/:imageId', prod.deleteProductImage);
router.get('/categories', cat.getCategories);
router.post('/categories', cat.createCategory);
router.put('/categories/:id', cat.updateCategory);
router.delete('/categories/:id', cat.deleteCategory);
router.get('/coupons', admin.getCoupons);
router.post('/coupons', admin.createCoupon);
router.put('/coupons/:id', admin.updateCoupon);
router.delete('/coupons/:id', admin.deleteCoupon);
router.get('/reviews', admin.getReviews);
router.delete('/reviews/:id', admin.deleteReview);
router.put('/reviews/:id/visibility', admin.toggleReviewVisibility);
router.get('/settings', admin.getSettings);
router.put('/settings', admin.updateSettings);

module.exports = router;
