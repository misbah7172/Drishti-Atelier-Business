/**
 * Cloudinary On-the-Fly Image Optimizer for Drishti Atelier
 * 
 * Automatically applies:
 * - f_auto: Serves modern formats (AVIF / WebP) based on browser support
 * - q_auto: Intelligent compression without perceptual loss
 * - w_{width}: Responsive width sizing
 * - c_limit: Never upscales small images
 * 
 * For local static paths (/images/...), leaves the URL untouched.
 */
export function optimizeImage(url, { width = 800, quality = 'auto' } = {}) {
  if (!url || typeof url !== 'string') {
    return '/images/frame-placeholder.svg';
  }

  // Check if it is a Cloudinary URL
  if (url.includes('res.cloudinary.com') && url.includes('/upload/')) {
    // Avoid double transformation if already present
    if (url.includes('/f_auto')) {
      return url;
    }
    const [base, assetPath] = url.split('/upload/');
    const transform = `f_auto,q_${quality},w_${width},c_limit`;
    return `${base}/upload/${transform}/${assetPath}`;
  }

  return url;
}

export default optimizeImage;
