const express = require('express');
const router = express.Router();
const banner = require('../controllers/bannerController');

// Public route to get active banners
router.get('/', banner.getPublicBanners);

module.exports = router;
