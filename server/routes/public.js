const express = require('express');
const router = express.Router();
const { submitContact, subscribeNewsletter } = require('../controllers/publicController');
const { getPublicSettings, getHomepageSections } = require('../controllers/adminController');

router.post('/contact', submitContact);
router.post('/newsletter', subscribeNewsletter);
router.get('/settings', getPublicSettings);
router.get('/homepage/sections', getHomepageSections);

module.exports = router;

