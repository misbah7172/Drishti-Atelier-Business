const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticateToken } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/admin');
const upload = require('../middleware/upload');

// Public routes
router.get('/', productController.getProducts);
router.get('/featured', productController.getFeaturedProducts);
router.get('/:idOrSlug', productController.getProductByIdOrSlug);

// Admin-only routes
router.post('/', authenticateToken, requireAdmin, productController.createProduct);
router.put('/:id', authenticateToken, requireAdmin, productController.updateProduct);
router.delete('/:id', authenticateToken, requireAdmin, productController.deleteProduct);

// Image management routes (Admin only)
router.post('/:id/images', authenticateToken, requireAdmin, upload.array('images', 6), productController.uploadProductImages);
router.delete('/:id/images/:imageId', authenticateToken, requireAdmin, productController.deleteProductImage);

module.exports = router;
