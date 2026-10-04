const express = require('express');
const router = express.Router();
const { submitContact, subscribeNewsletter } = require('../controllers/publicController');

router.post('/contact', submitContact);
router.post('/newsletter', subscribeNewsletter);

module.exports = router;
