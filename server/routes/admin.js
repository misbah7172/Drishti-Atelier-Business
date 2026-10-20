const express = require('express');
const router = express.Router();
const admin = require('../controllers/adminController');
const cat = require('../controllers/categoryController');
const prod = require('../controllers/productController');
const banner = require('../controllers/bannerController');
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
router.get('/products/:id', prod.getProductByIdOrSlug);
router.put('/products/:id', prod.updateProduct);
router.delete('/products/:id', prod.deleteProduct);
router.post('/products/:id/images', upload.array('images', 6), prod.uploadProductImages);
router.post('/products/:id/images/url', prod.addProductImageUrl);
router.put('/products/:id/images/:imageId/primary', prod.setPrimaryProductImage);
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

// Banner Management (Hero Slider & Section Banners)
router.get('/banners', banner.getAdminBanners);
router.post('/banners', upload.single('image'), banner.createBanner);
router.put('/banners/reorder', banner.reorderBanners);
router.get('/banners/:id', banner.getBannerById);
router.put('/banners/:id', upload.single('image'), banner.updateBanner);
router.delete('/banners/:id', banner.deleteBanner);
router.patch('/banners/:id/toggle', banner.toggleBannerStatus);

// Homepage Sections Customization
router.get('/homepage/sections', admin.getHomepageSections);
router.put('/homepage/sections', admin.updateHomepageSections);

module.exports = router;

