import api from './api';

export const DEFAULT_HOMEPAGE_SECTIONS = [
  { id: 'hero', name: 'Hero Sliding Carousel', enabled: true, description: 'Top dynamic hero slider with editorial banners and CTAs' },
  { id: 'top-categories', name: 'Curated Top Categories', enabled: true, description: 'Category cards taxonomy with image links' },
  { id: 'banner-categories', name: 'Categories Slide Banner', enabled: true, description: '1500x500px slide banner below categories' },
  { id: 'shape-guide', name: 'Eyeglasses Shape & Anatomy Guide', enabled: true, description: 'Interactive frame anatomy and facial proportion guide' },
  { id: 'banner-anatomy', name: 'Tortoiseshell Showcase Banner', enabled: true, description: 'Firmoo-style 4 sub-items showcase banner' },
  { id: 'featured-products', name: 'Featured Products Carousel', enabled: true, description: 'Auto-sliding horizontal product showcase' },
  { id: 'hot-selling-products', name: 'Hot Selling Products Carousel', enabled: true, description: 'Auto-sliding bestseller carousel' },
  { id: 'testimonials', name: 'High-Fashion Editorial Testimonials', enabled: true, description: 'Vogue/GQ social proof quotes and customer stories' },
  { id: 'final-cta', name: 'High-Impact Conversion Finale', enabled: true, description: 'Signature privilege and global delivery CTA' },
  { id: 'banner-finale', name: 'Titanium Architecture Showcase Banner', enabled: true, description: 'Titanium architecture showcase banner' },
  { id: 'brands', name: 'Our House Brands', enabled: true, description: 'Partner brand logos above the footer' },
];

/**
 * Fetch homepage sections for public storefront
 */
export async function getPublicHomepageSections() {
  const res = await api.get('/homepage/sections');
  return res.data.data;
}

/**
 * Fetch homepage sections for admin layout editor
 */
export async function getAdminHomepageSections() {
  const res = await api.get('/admin/homepage/sections');
  return res.data.data;
}

/**
 * Save updated homepage sections order & enabled status
 * @param {Array} sections
 */
export async function updateHomepageSections(sections) {
  const res = await api.put('/admin/homepage/sections', { sections });
  return res.data;
}
