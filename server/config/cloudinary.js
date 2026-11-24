const cloudinary = require('cloudinary').v2;

// Support both full CLOUDINARY_URL and separate credentials
if (process.env.CLOUDINARY_URL) {
  cloudinary.config({
    cloudinary_url: process.env.CLOUDINARY_URL,
  });
} else {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

/**
 * Upload an image to Cloudinary with automatic optimization (WebP/AVIF + auto quality)
 * @param {string} filePath - Path or base64 of the file to upload
 * @param {object} options - Upload options
 * @returns {Promise<object>} Cloudinary upload result
 */
async function uploadImage(filePath, options = {}) {
  const defaultOptions = {
    folder: 'drishti-atelier/products',
    transformation: [
      { width: 1400, height: 1400, crop: 'limit', quality: 'auto', fetch_format: 'auto' },
    ],
    ...options,
  };

  return cloudinary.uploader.upload(filePath, defaultOptions);
}

/**
 * Delete an image from Cloudinary
 * @param {string} publicId - Cloudinary public ID
 * @returns {Promise<object>}
 */
async function deleteImage(publicId) {
  return cloudinary.uploader.destroy(publicId);
}

module.exports = {
  cloudinary,
  uploadImage,
  deleteImage,
};
