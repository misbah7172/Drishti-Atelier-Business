const express = require('express');
const router = express.Router();
const { submitContact, subscribeNewsletter } = require('../controllers/publicController');
const { getPublicSettings } = require('../controllers/adminController');

router.post('/contact', submitContact);
router.post('/newsletter', subscribeNewsletter);
router.get('/settings', getPublicSettings);

module.exports = router;
