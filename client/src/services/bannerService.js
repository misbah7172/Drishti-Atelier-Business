import api from './api';

/**
 * Fetch public active banners for storefront
 * @param {string} section - 'hero' | 'categories' | 'anatomy' | 'finale'
 */
export async function getPublicBanners(section = 'hero') {
  const res = await api.get(`/banners?section=${encodeURIComponent(section)}`);
  return res.data.data;
}

/**
 * Fetch all banners for admin console
 * @param {string} section - 'all' | 'hero' | etc.
 */
export async function getAdminBanners(section = 'all') {
  const query = section && section !== 'all' ? `?section=${encodeURIComponent(section)}` : '';
  const res = await api.get(`/admin/banners${query}`);
  return res.data.data;
}

/**
 * Create a new banner
 * @param {FormData | object} data
 */
export async function createBanner(data) {
  const isFormData = data instanceof FormData;
  const config = isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
  const res = await api.post('/admin/banners', data, config);
  return res.data.data;
}

/**
 * Update an existing banner
 * @param {number|string} id
 * @param {FormData | object} data
 */
export async function updateBanner(id, data) {
  const isFormData = data instanceof FormData;
  const config = isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
  const res = await api.put(`/admin/banners/${id}`, data, config);
  return res.data.data;
}

/**
 * Delete a banner
 * @param {number|string} id
 */
export async function deleteBanner(id) {
  const res = await api.delete(`/admin/banners/${id}`);
  return res.data.data;
}

/**
 * Toggle active status
 * @param {number|string} id
 */
export async function toggleBannerStatus(id) {
  const res = await api.patch(`/admin/banners/${id}/toggle`);
  return res.data.data;
}

/**
 * Reorder banners in bulk
 * @param {Array<{id: number, sort_order: number}>} items
 */
export async function reorderBanners(items) {
  const res = await api.put('/admin/banners/reorder', { items });
  return res.data;
}
