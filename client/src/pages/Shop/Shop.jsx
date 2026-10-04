import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  HiOutlineMagnifyingGlass,
  HiXMark,
  HiAdjustmentsHorizontal,
  HiChevronLeft,
  HiChevronRight,
  HiArrowPath,
} from 'react-icons/hi2';
import ProductCard from '../../components/ProductCard/ProductCard';
import SlideBanner from '../../components/SlideBanner/SlideBanner';
import { fetchProducts, fetchCategories } from '../../services/productService';
import SEO from '../../components/SEO/SEO';
import './Shop.css';

// Filter constants aligned with DB catalog
const SHAPES = [
  'all',
  'Aviator',
  'Rectangle',
  'Round',
  'Cat Eye',
  'Wayfarer',
  'Oval',
  'Square',
  'Geometric',
  'Browline',
  'Rimless',
];

const MATERIALS = [
  'all',
  'Titanium',
  'Acetate',
  'Metal',
  'Stainless Steel',
  'TR-90',
];

const GENDERS = [
  { value: 'all', label: 'All Genders' },
  { value: 'men', label: 'Men' },
  { value: 'women', label: 'Women' },
  { value: 'unisex', label: 'Unisex' },
];

const PRICE_RANGES = [
  { value: 'all', label: 'All Prices' },
  { value: 'under-1500', label: 'Under $1,500', min: null, max: 1500 },
  { value: '1500-2500', label: '$1,500 – $2,500', min: 1500, max: 2500 },
  { value: '2500-3500', label: '$2,500 – $3,500', min: 2500, max: 3500 },
  { value: 'above-3500', label: '$3,500 & Above', min: 3500, max: null },
];

// Debounce hook
function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL state synchronization
  const activeCategory = searchParams.get('category') || 'all';
  const selectedShape = searchParams.get('shape') || 'all';
  const selectedMaterial = searchParams.get('material') || 'all';
  const selectedGender = searchParams.get('gender') || 'all';
  const selectedPrice = searchParams.get('price') || 'all';
  const sortBy = searchParams.get('sort') || 'featured';
  const urlSearch = searchParams.get('search') || '';
  const urlPage = parseInt(searchParams.get('page'), 10) || 1;

  // Local state
  const [searchQuery, setSearchQuery] = useState(urlSearch);
  const [filtersDrawerOpen, setFiltersDrawerOpen] = useState(false);

  // Sync searchQuery with URL if URL changes externally
  useEffect(() => {
    setSearchQuery(urlSearch);
  }, [urlSearch]);

  // Debounced search
  const debouncedSearch = useDebounce(searchQuery, 400);

  // Sync debounced search to URL
  useEffect(() => {
    const currentParam = searchParams.get('search') || '';
    if (debouncedSearch.trim() !== currentParam) {
      const newParams = new URLSearchParams(searchParams);
      if (debouncedSearch.trim()) {
        newParams.set('search', debouncedSearch.trim());
      } else {
        newParams.delete('search');
      }
      newParams.delete('page');
      setSearchParams(newParams, { replace: true });
    }
  }, [debouncedSearch, searchParams, setSearchParams]);

  // API state
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 12, totalPages: 1 });
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Ref to prevent race conditions
  const fetchIdRef = useRef(0);

  // Map frontend sort to API sort values
  const sortMap = {
    featured: 'newest',
    'price-low': 'price_asc',
    'price-high': 'price_desc',
    newest: 'newest',
    popular: 'popular',
    'name-asc': 'name_asc',
  };

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories()
      .then((cats) => setCategories(cats || []))
      .catch((err) => console.error('Category fetch error:', err));
  }, []);

  // Update a single filter in the URL params
  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (!value || value === 'all') {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    newParams.delete('page'); // Reset to page 1 on filter change
    setSearchParams(newParams);
  };

  // Main product fetch
  const loadProducts = useCallback(async () => {
    const fetchId = ++fetchIdRef.current;
    setIsLoading(true);
    setError(null);

    try {
      const params = {
        page: urlPage,
        limit: 12,
        sort: sortMap[sortBy] || 'newest',
      };

      // Category
      if (activeCategory !== 'all') {
        params.category = activeCategory;
      }

      // Shape
      if (selectedShape !== 'all') {
        params.frame_shape = selectedShape;
      }

      // Material
      if (selectedMaterial !== 'all') {
        params.frame_material = selectedMaterial;
      }

      // Gender
      if (selectedGender !== 'all') {
        params.gender = selectedGender;
      }

      // Price Range
      const priceConfig = PRICE_RANGES.find((p) => p.value === selectedPrice);
      if (priceConfig) {
        if (priceConfig.min !== null) params.min_price = priceConfig.min;
        if (priceConfig.max !== null) params.max_price = priceConfig.max;
      }

      // Search
      if (urlSearch.trim()) {
        params.search = urlSearch.trim();
      }

      const result = await fetchProducts(params);

      // Guard against stale responses
      if (fetchId !== fetchIdRef.current) return;

      setProducts(result.products || []);
      setPagination(result.pagination || { total: 0, page: 1, limit: 12, totalPages: 1 });
    } catch (err) {
      if (fetchId !== fetchIdRef.current) return;
      setError('Unable to reach our optical archive. Please check your connection.');
      console.error('Product fetch error:', err);
    } finally {
      if (fetchId === fetchIdRef.current) {
        setIsLoading(false);
      }
    }
  }, [activeCategory, selectedShape, selectedMaterial, selectedGender, selectedPrice, sortBy, urlSearch, urlPage]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Page change handler
  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    if (newPage <= 1) {
      newParams.delete('page');
    } else {
      newParams.set('page', String(newPage));
    }
    setSearchParams(newParams);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setSearchParams({});
  };

  // Compute active filter count (excluding category if on main categories tab)
  const activeFiltersCount =
    (selectedShape !== 'all' ? 1 : 0) +
    (selectedMaterial !== 'all' ? 1 : 0) +
    (selectedGender !== 'all' ? 1 : 0) +
    (selectedPrice !== 'all' ? 1 : 0) +
    (urlSearch.trim() ? 1 : 0);

  const hasAnyFilter =
    activeCategory !== 'all' ||
    activeFiltersCount > 0;

  // Build dynamic category pills from API
  const categoryPills = [
    { slug: 'all', name: 'All Editions', count: null },
    ...categories.map((cat) => ({
      slug: cat.slug,
      name: cat.name,
      count: parseInt(cat.product_count, 10) || 0,
    })),
  ];

  // Dynamic SEO Title
  const activeCategoryObj = categories.find((c) => c.slug === activeCategory);
  const pageTitle = activeCategoryObj
    ? `Shop ${activeCategoryObj.name} | Drishti Atelier`
    : 'Shop Eyewear Archive | Drishti Atelier';

  return (
    <div className="shop-page" id="shop-catalog">
      <SEO
        title={pageTitle}
        description="Browse our curated collection of luxury sunglasses, optical frames, and blue light glasses crafted from titanium and premium acetate."
      />

      {/* 1500x500 (3:1) Sliding Banner Section */}
      <SlideBanner
        id="shop-catalog-banner"
        ariaLabel="Shop Eyewear Collection Banner"
        preset="shop"
        className="shop-slider-section"
      />

      {/* Primary Category Nav & Controls Bar */}
      <nav className="shop-category-nav container-editorial" aria-label="Product categories">
        {/* Category Pills Strip */}
        <div className="category-pills">
          {categoryPills.map((cat) => (
            <button
              key={cat.slug}
              type="button"
              className={`shop-category-btn ${activeCategory === cat.slug ? 'cat-active' : ''}`}
              onClick={() => updateFilter('category', cat.slug)}
            >
              <span className="cat-name">{cat.name}</span>
              {cat.count !== null && (
                <span className="cat-count">({cat.count})</span>
              )}
              {activeCategory === cat.slug && <span className="cat-active-line" aria-hidden="true" />}
            </button>
          ))}
        </div>

        {/* Search Bar & Filter Controls Cluster */}
        <div className="shop-controls-cluster">
          {/* Search Bar */}
          <div className="shop-search-bar">
            <HiOutlineMagnifyingGlass size={17} className="shop-search-icon" aria-hidden="true" />
            <input
              type="text"
              placeholder="Search by model, shape, titanium..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="shop-search-input"
              aria-label="Search catalog"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="shop-search-clear"
                aria-label="Clear search query"
              >
                <HiXMark size={16} />
              </button>
            )}
          </div>

          {/* Filter Drawer Toggle */}
          <button
            type="button"
            className={`shop-filter-toggle ${filtersDrawerOpen ? 'filter-open' : ''} ${
              activeFiltersCount > 0 ? 'has-active-filters' : ''
            }`}
            onClick={() => setFiltersDrawerOpen(!filtersDrawerOpen)}
            aria-expanded={filtersDrawerOpen}
            aria-controls="shop-filters-drawer"
          >
            <HiAdjustmentsHorizontal size={17} />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="filter-badge-count">{activeFiltersCount}</span>
            )}
          </button>

          {/* Sort Dropdown */}
          <div className="shop-sort-wrapper">
            <label htmlFor="shop-sort-select" className="sr-only">Sort products</label>
            <select
              id="shop-sort-select"
              value={sortBy}
              onChange={(e) => updateFilter('sort', e.target.value)}
              className="shop-sort-select"
            >
              <option value="featured">Featured Order</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest Arrivals</option>
              <option value="popular">Popular Editions</option>
              <option value="name-asc">Alphabetical (A–Z)</option>
            </select>
          </div>
        </div>
      </nav>

      {/* Expandable Sub-Filter Drawer */}
      {filtersDrawerOpen && (
        <div className="shop-filters-drawer container-editorial" id="shop-filters-drawer">
          <div className="drawer-filters-grid">
            {/* Shape Filter */}
            <div className="filter-block">
              <span className="filter-block-title">Frame Shape</span>
              <div className="filter-chip-row">
                {SHAPES.map((shape) => (
                  <button
                    key={shape}
                    type="button"
                    className={`filter-chip ${selectedShape === shape ? 'chip-active' : ''}`}
                    onClick={() => updateFilter('shape', shape)}
                  >
                    {shape === 'all' ? 'All Shapes' : shape}
                  </button>
                ))}
              </div>
            </div>

            {/* Material Filter */}
            <div className="filter-block">
              <span className="filter-block-title">Material Craft</span>
              <div className="filter-chip-row">
                {MATERIALS.map((mat) => (
                  <button
                    key={mat}
                    type="button"
                    className={`filter-chip ${selectedMaterial === mat ? 'chip-active' : ''}`}
                    onClick={() => updateFilter('material', mat)}
                  >
                    {mat === 'all' ? 'All Materials' : mat}
                  </button>
                ))}
              </div>
            </div>

            {/* Gender Filter */}
            <div className="filter-block">
              <span className="filter-block-title">Gender & Fit</span>
              <div className="filter-chip-row">
                {GENDERS.map((g) => (
                  <button
                    key={g.value}
                    type="button"
                    className={`filter-chip ${selectedGender === g.value ? 'chip-active' : ''}`}
                    onClick={() => updateFilter('gender', g.value)}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="filter-block">
              <span className="filter-block-title">Price Tier</span>
              <div className="filter-chip-row">
                {PRICE_RANGES.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    className={`filter-chip ${selectedPrice === p.value ? 'chip-active' : ''}`}
                    onClick={() => updateFilter('price', p.value)}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Drawer Actions */}
          <div className="drawer-footer-actions">
            {hasAnyFilter && (
              <button
                type="button"
                onClick={resetFilters}
                className="btn-editorial-reset"
              >
                <HiXMark size={14} />
                <span>Reset All Filters</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setFiltersDrawerOpen(false)}
              className="btn-editorial-apply"
            >
              View Results ({pagination.total})
            </button>
          </div>
        </div>
      )}

      {/* Active Filter Chips Bar (Instant Visual Feedback & Quick Removal) */}
      {hasAnyFilter && (
        <div className="shop-active-chips-bar container-editorial">
          <span className="active-chips-label">Active Filters:</span>
          <div className="active-chips-wrap">
            {activeCategory !== 'all' && (
              <button
                type="button"
                className="active-filter-tag"
                onClick={() => updateFilter('category', 'all')}
                title="Remove category filter"
              >
                <span>Category: {activeCategoryObj?.name || activeCategory}</span>
                <HiXMark size={13} />
              </button>
            )}

            {selectedShape !== 'all' && (
              <button
                type="button"
                className="active-filter-tag"
                onClick={() => updateFilter('shape', 'all')}
                title="Remove shape filter"
              >
                <span>Shape: {selectedShape}</span>
                <HiXMark size={13} />
              </button>
            )}

            {selectedMaterial !== 'all' && (
              <button
                type="button"
                className="active-filter-tag"
                onClick={() => updateFilter('material', 'all')}
                title="Remove material filter"
              >
                <span>Material: {selectedMaterial}</span>
                <HiXMark size={13} />
              </button>
            )}

            {selectedGender !== 'all' && (
              <button
                type="button"
                className="active-filter-tag"
                onClick={() => updateFilter('gender', 'all')}
                title="Remove gender filter"
              >
                <span>Gender: {selectedGender}</span>
                <HiXMark size={13} />
              </button>
            )}

            {selectedPrice !== 'all' && (
              <button
                type="button"
                className="active-filter-tag"
                onClick={() => updateFilter('price', 'all')}
                title="Remove price filter"
              >
                <span>Price: {PRICE_RANGES.find((p) => p.value === selectedPrice)?.label}</span>
                <HiXMark size={13} />
              </button>
            )}

            {urlSearch.trim() && (
              <button
                type="button"
                className="active-filter-tag"
                onClick={() => {
                  setSearchQuery('');
                  updateFilter('search', '');
                }}
                title="Remove search filter"
              >
                <span>Search: &ldquo;{urlSearch.trim()}&rdquo;</span>
                <HiXMark size={13} />
              </button>
            )}

            <button
              type="button"
              onClick={resetFilters}
              className="clear-all-chips-btn"
            >
              Clear All
            </button>
          </div>
        </div>
      )}

      {/* Main Product Grid Section */}
      <main className="shop-grid-section container-editorial">
        {/* Results Counter & Header */}
        <div className="shop-count-bar">
          <span className="shop-count-text">
            {isLoading ? (
              <span className="loading-count-text">Discovering atelier archive…</span>
            ) : (
              <>
                Showing <strong className="count-number">{products.length}</strong> of{' '}
                <strong className="count-number">{pagination.total}</strong> Editions
              </>
            )}
          </span>
        </div>

        {/* Loading State: Skeleton Shimmer Grid */}
        {isLoading && (
          <div className="shop-loading-grid" aria-label="Loading products">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="product-skeleton-card">
                <div className="skeleton-image shimmer" />
                <div className="skeleton-meta">
                  <div className="skeleton-line skeleton-short shimmer" />
                  <div className="skeleton-line shimmer" />
                  <div className="skeleton-line skeleton-medium shimmer" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="shop-empty-state">
            <span className="editorial-eyebrow">Archive Unavailable</span>
            <h3 className="empty-title">CONNECTION ERROR</h3>
            <p className="editorial-body empty-desc">{error}</p>
            <button
              type="button"
              onClick={loadProducts}
              className="btn-editorial"
            >
              <HiArrowPath size={16} />
              <span>Retry Search</span>
            </button>
          </div>
        )}

        {/* Products Grid */}
        {!isLoading && !error && products.length > 0 && (
          <>
            <div className="shop-editorial-grid" id="product-grid">
              {products.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <nav className="shop-pagination" aria-label="Catalog pages">
                <button
                  type="button"
                  className="pagination-btn"
                  disabled={pagination.page <= 1}
                  onClick={() => handlePageChange(pagination.page - 1)}
                  aria-label="Previous page"
                >
                  <HiChevronLeft size={18} />
                </button>

                <div className="pagination-numbers">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                    .filter((p) => {
                      return (
                        p === 1 ||
                        p === pagination.totalPages ||
                        Math.abs(p - pagination.page) <= 1
                      );
                    })
                    .map((p, idx, arr) => (
                      <span key={p} className="pagination-item-wrap">
                        {idx > 0 && arr[idx - 1] !== p - 1 && (
                          <span className="pagination-ellipsis">&hellip;</span>
                        )}
                        <button
                          type="button"
                          className={`pagination-num ${pagination.page === p ? 'page-active' : ''}`}
                          onClick={() => handlePageChange(p)}
                          aria-label={`Go to page ${p}`}
                          aria-current={pagination.page === p ? 'page' : undefined}
                        >
                          {p}
                        </button>
                      </span>
                    ))}
                </div>

                <button
                  type="button"
                  className="pagination-btn"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => handlePageChange(pagination.page + 1)}
                  aria-label="Next page"
                >
                  <HiChevronRight size={18} />
                </button>
              </nav>
            )}
          </>
        )}

        {/* Empty State */}
        {!isLoading && !error && products.length === 0 && (
          <div className="shop-empty-state">
            <span className="editorial-eyebrow">Zero Matches</span>
            <h3 className="empty-title">NO FRAMES MATCH YOUR CRITERIA</h3>
            <p className="editorial-body empty-desc">
              We couldn&apos;t find any eyewear editions matching your exact combination of
              filters. Try adjusting your search query, shapes, or materials.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="btn-editorial"
            >
              <span>Explore Full Archive</span>
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
