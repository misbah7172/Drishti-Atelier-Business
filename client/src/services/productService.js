/**
 * Drishti Atelier — Product & Category API Service
 * Wraps backend REST endpoints for the frontend product system
 */
import api from './api';

// ============================================
// Fallback images for products without uploads
// ============================================
const FALLBACK_IMAGES = [
  '/images/blue-aviator.png',
  '/images/amber-aviator.png',
  '/images/hero-glasses.png',
  '/images/heart-sunglasses.png',
  '/images/dark-silhouette.png',
  '/images/lifestyle-model.png',
];

/**
 * Get a deterministic fallback image based on product ID
 */
function getFallbackImage(productId) {
  const idx = (productId || 1) % FALLBACK_IMAGES.length;
  return FALLBACK_IMAGES[idx];
}

/**
 * Get a second fallback for hover effect
 */
function getFallbackHoverImage(productId) {
  const idx = ((productId || 1) + 1) % FALLBACK_IMAGES.length;
  return FALLBACK_IMAGES[idx];
}

/**
 * Derive a badge label from product flags
 */
function deriveBadge(product) {
  if (product.featured) return 'Atelier Pick';
  if (product.new_arrival) return 'New Arrival';
  if (product.bestseller) return 'Bestseller';
  if (product.compare_price && parseFloat(product.compare_price) > parseFloat(product.price)) return 'Limited Run';
  return null;
}

/**
 * Generate an editorial code from SKU or category
 */
function deriveCode(product) {
  if (product.sku) return product.sku;
  const catLabel = (product.category_slug || 'frame').toUpperCase().replace(/-/g, ' ');
  return `ATELIER ${String(product.id).padStart(2, '0')} — ${catLabel}`;
}

/**
 * Parse frame_color string into color swatches array
 * DB stores: "Gold / Amber" or "Black" etc.
 */
const COLOR_HEX_MAP = {
  'black': '#1A1A1A',
  'gold': '#D4AF37',
  'silver': '#C0C0C0',
  'tortoise': '#8B4513',
  'havana': '#8B4513',
  'amber': '#E68A00',
  'blue': '#3B5998',
  'rose': '#B76E79',
  'gunmetal': '#6D6E71',
  'clear': '#E8E8E8',
  'brown': '#6B3A2A',
  'green': '#2E5D3A',
  'red': '#8B2500',
  'pink': '#FFB6C1',
  'white': '#F5F5F5',
  'matte black': '#2A2A2A',
  'glossy black': '#050505',
  'crystal': '#E0E0E0',
};

function parseColors(frameColor) {
  if (!frameColor) return [{ name: 'Classic', hex: '#1A1A1A' }];

  const parts = frameColor.split(/[\/,&]/).map((s) => s.trim().toLowerCase());
  const colors = parts
    .map((part) => {
      const hex = COLOR_HEX_MAP[part] || null;
      if (hex) return { name: part.charAt(0).toUpperCase() + part.slice(1), hex };
      // Try partial match
      const matchKey = Object.keys(COLOR_HEX_MAP).find((k) => part.includes(k));
      if (matchKey) return { name: part.charAt(0).toUpperCase() + part.slice(1), hex: COLOR_HEX_MAP[matchKey] };
      return { name: part.charAt(0).toUpperCase() + part.slice(1), hex: '#1A1A1A' };
    })
    .filter(Boolean);

  return colors.length > 0 ? colors : [{ name: 'Classic', hex: '#1A1A1A' }];
}

/**
 * Normalize an API product into the shape the frontend components expect
 */
export function normalizeProduct(apiProduct) {
  return {
    // Core identity
    id: apiProduct.id,
    slug: apiProduct.slug,
    name: apiProduct.name,
    sku: apiProduct.sku,
    code: deriveCode(apiProduct),

    // Category
    category: apiProduct.category_slug || '',
    categoryLabel: apiProduct.category_name || '',
    subcategory: apiProduct.subcategory_slug || '',
    subcategoryLabel: apiProduct.subcategory_name || '',

    // Price
    price: parseFloat(apiProduct.price) || 0,
    comparePrice: apiProduct.compare_price ? parseFloat(apiProduct.compare_price) : null,

    // Visuals
    image: apiProduct.primary_image || getFallbackImage(apiProduct.id),
    hoverImage: getFallbackHoverImage(apiProduct.id),
    colors: parseColors(apiProduct.frame_color),

    // Badge
    badge: deriveBadge(apiProduct),

    // Specs
    brand: apiProduct.brand || 'Drishti Atelier',
    material: apiProduct.frame_material || '—',
    shape: apiProduct.frame_shape || '—',
    gender: apiProduct.gender || 'unisex',
    size: apiProduct.size || 'Medium',

    // Text
    description: apiProduct.description || '',
    shortDescription: apiProduct.short_description || '',

    // Stock & flags
    stock: apiProduct.stock || 0,
    featured: apiProduct.featured || false,
    bestseller: apiProduct.bestseller || false,
    newArrival: apiProduct.new_arrival || false,

    // Rating
    averageRating: apiProduct.average_rating ? parseFloat(apiProduct.average_rating) : 5.0,
    reviewCount: parseInt(apiProduct.review_count) || 0,

    // Detail-only (populated when fetching single product)
    images: apiProduct.images || [],
    tags: apiProduct.tags || [],
    reviews: apiProduct.reviews || [],

    // Build gallery from images array or fallbacks
    gallery: buildGallery(apiProduct),
  };
}

/**
 * Build a gallery array for the ProductDetail page
 */
function buildGallery(product) {
  if (product.images && product.images.length > 0) {
    return product.images.map((img, idx) => ({
      id: `img-${img.id || idx}`,
      label: img.alt_text || `View ${idx + 1}`,
      src: img.image_url,
      caption: img.alt_text || `${product.name} — Angle ${idx + 1}`,
    }));
  }

  // Fallback gallery from local images
  const fallbackIdx = (product.id || 1) % FALLBACK_IMAGES.length;
  return [
    {
      id: 'front',
      label: 'Front Symmetry',
      src: FALLBACK_IMAGES[fallbackIdx],
      caption: 'Symmetrical optical balance with dual caustics.',
    },
    {
      id: 'profile45',
      label: '45° Angle',
      src: FALLBACK_IMAGES[(fallbackIdx + 1) % FALLBACK_IMAGES.length],
      caption: 'Three-quarter depth showing brow arch & lens bevel.',
    },
    {
      id: 'temple',
      label: 'Temple Detail',
      src: FALLBACK_IMAGES[(fallbackIdx + 2) % FALLBACK_IMAGES.length],
      caption: 'Precision hinge architecture and tapered earstems.',
    },
  ];
}

// ============================================
// API CALLS
// ============================================

/**
 * Fetch paginated, filtered product list
 * @param {Object} params - { search, category, subcategory, gender, frame_shape, frame_material, min_price, max_price, sort, page, limit, featured, bestseller, new_arrival }
 * @returns {{ products: Array, pagination: Object }}
 */
export async function fetchProducts(params = {}) {
  try {
    // Clean out empty/undefined params
    const cleanParams = {};
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '' && val !== 'all') {
        cleanParams[key] = val;
      }
    });

    const response = await api.get('/products', { params: cleanParams });
    const { products, pagination } = response.data.data;

    return {
      products: products.map(normalizeProduct),
      pagination,
    };
  } catch (error) {
    console.error('Failed to fetch products:', error);
    throw error;
  }
}

/**
 * Fetch featured products for homepage sections
 */
export async function fetchFeaturedProducts() {
  try {
    const response = await api.get('/products/featured');
    return response.data.data.map(normalizeProduct);
  } catch (error) {
    console.error('Failed to fetch featured products:', error);
    throw error;
  }
}

/**
 * Fetch bestseller products for homepage "Hot Selling" carousel
 */
export async function fetchBestsellerProducts(limit = 10) {
  try {
    const response = await api.get('/products', {
      params: { bestseller: 'true', limit, sort: 'bestseller' },
    });
    return response.data.data.products.map(normalizeProduct);
  } catch (error) {
    console.error('Failed to fetch bestseller products:', error);
    // Fallback: try featured endpoint
    try {
      const fallback = await api.get('/products/featured');
      return fallback.data.data.map(normalizeProduct).slice(0, limit);
    } catch {
      return [];
    }
  }
}

/**
 * Fetch a single product by ID or slug (includes images, tags, reviews)
 */
export async function fetchProductByIdOrSlug(idOrSlug) {
  try {
    const response = await api.get(`/products/${idOrSlug}`);
    return normalizeProduct(response.data.data);
  } catch (error) {
    console.error('Failed to fetch product:', error);
    throw error;
  }
}

/**
 * Fetch all categories with subcategories
 */
export async function fetchCategories() {
  try {
    const response = await api.get('/categories');
    return response.data.data;
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    throw error;
  }
}

/**
 * Fetch a single category by ID or slug
 */
export async function fetchCategoryByIdOrSlug(idOrSlug) {
  try {
    const response = await api.get(`/categories/${idOrSlug}`);
    return response.data.data;
  } catch (error) {
    console.error('Failed to fetch category:', error);
    throw error;
  }
}
