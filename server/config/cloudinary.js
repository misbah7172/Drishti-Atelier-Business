const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload an image to Cloudinary
 * @param {string} filePath - Path or base64 of the file to upload
 * @param {object} options - Upload options
 * @returns {Promise<object>} Cloudinary upload result
 */
async function uploadImage(filePath, options = {}) {
  const defaultOptions = {
    folder: 'Drishti-Atelier/products',
    transformation: [
      { width: 1200, height: 1200, crop: 'limit', quality: 'auto', fetch_format: 'auto' },
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
