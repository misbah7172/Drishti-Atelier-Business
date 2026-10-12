const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

// Configure disk storage for temp upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    // H-06: Use crypto-random filename to prevent path traversal
    const ext = path.extname(file.originalname).toLowerCase();
    const allowedExts = ['.jpg', '.jpeg', '.png', '.webp', '.avif'];
    if (!allowedExts.includes(ext)) {
      return cb(new Error('Invalid file extension'), false);
    }
    const safeName = 'product-' + crypto.randomBytes(16).toString('hex') + ext;
    cb(null, safeName);
  },
});

// File filter (accept images only — MIME check)
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, WEBP, and AVIF images are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB max per file
    files: 6, // Max 6 images per batch
  },
});

module.exports = upload;
