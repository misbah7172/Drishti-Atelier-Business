import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { HiOutlineMagnifyingGlass, HiXMark, HiAdjustmentsHorizontal, HiChevronLeft, HiChevronRight } from 'react-icons/hi2';
import ProductCard from '../../components/ProductCard/ProductCard';
import SlideBanner from '../../components/SlideBanner/SlideBanner';
import { fetchProducts, fetchCategories } from '../../services/productService';
import SEO from '../../components/SEO/SEO';
import './Shop.css';

const SHAPES = ['all', 'Aviator', 'Rectangle', 'Round', 'Cat Eye', 'Wayfarer', 'Oval', 'Square', 'Browline'];
const MATERIALS = ['all', 'Titanium', 'Acetate', 'Metal', 'TR-90'];

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
  const urlShape = searchParams.get('shape') || 'all';
  const searchParam = searchParams.get('search') || '';
  const urlPage = parseInt(searchParams.get('page')) || 1;

  // Local filter state
  const [selectedShape, setSelectedShape] = useState(urlShape);
  const [prevUrlShape, setPrevUrlShape] = useState(urlShape);

  if (urlShape !== prevUrlShape) {
    setPrevUrlShape(urlShape);
    setSelectedShape(urlShape);
  }

  const [selectedMaterial, setSelectedMaterial] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [searchQuery, setSearchQuery] = useState(searchParam);
  const [filtersDrawerOpen, setFiltersDrawerOpen] = useState(false);

  // API state
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 12, totalPages: 1 });
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Debounced search
  const debouncedSearch = useDebounce(searchQuery, 400);

  // Ref to prevent double-fetch on mount
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
      .then((cats) => setCategories(cats))
      .catch((err) => console.error('Category fetch error:', err));
  }, []);

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

      // Search
      if (debouncedSearch.trim()) {
        params.search = debouncedSearch.trim();
      }

      const result = await fetchProducts(params);

      // Guard against stale responses
      if (fetchId !== fetchIdRef.current) return;

      setProducts(result.products);
      setPagination(result.pagination);
    } catch (err) {
      if (fetchId !== fetchIdRef.current) return;
      setError('Failed to load products. Please try again.');
      console.error('Product fetch error:', err);
    } finally {
      if (fetchId === fetchIdRef.current) {
        setIsLoading(false);
      }
    }
  }, [activeCategory, selectedShape, selectedMaterial, debouncedSearch, sortBy, urlPage]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Category change resets page
  const handleCategoryChange = (catSlugOrAll) => {
    const newParams = new URLSearchParams(searchParams);
    if (catSlugOrAll === 'all') {
      newParams.delete('category');
    } else {
      newParams.set('category', catSlugOrAll);
    }
    newParams.delete('page');
    setSearchParams(newParams);
  };

  // Page change
  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    if (newPage <= 1) {
      newParams.delete('page');
    } else {
      newParams.set('page', String(newPage));
    }
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetFilters = () => {
    setSelectedShape('all');
    setSelectedMaterial('all');
    setSortBy('featured');
    setSearchQuery('');
    setSearchParams({});
  };

  const hasActiveFilters =
    activeCategory !== 'all' ||
    selectedShape !== 'all' ||
    selectedMaterial !== 'all' ||
    Boolean(searchQuery.trim());

  // Build dynamic category pills from API
  const categoryPills = [
    { slug: 'all', name: 'All Editions', product_count: null },
    ...categories.map((cat) => ({
      slug: cat.slug,
      name: cat.name,
      product_count: parseInt(cat.product_count) || 0,
    })),
  ];

  return (
    <div className="shop-page" id="shop-catalog">
      <SEO title="Shop Eyewear" description="Browse our curated collection of luxury sunglasses, optical frames, and blue light glasses." />
      {/* 1500x500 (3:1) Sliding Banner Section */}
      <SlideBanner
        id="shop-catalog-banner"
        ariaLabel="Shop Eyewear Collection Banner"
        preset="shop"
        className="shop-slider-section"
      />

      {/* Primary Category Nav & Controls Bar — Driven by API */}
      <nav className="shop-category-nav container-editorial" aria-label="Product categories">
        <div className="category-pills">
          {categoryPills.map((cat) => (
            <button
              key={cat.slug}
              type="button"
              className={`shop-category-btn ${activeCategory === cat.slug ? 'cat-active' : ''}`}
              onClick={() => handleCategoryChange(cat.slug)}
            >
              <span>{cat.name}</span>
              {cat.product_count !== null && (
                <span className="cat-count">({cat.product_count})</span>
              )}
              {activeCategory === cat.slug && <span className="cat-active-line" aria-hidden="true" />}
            </button>
          ))}
        </div>

        {/* Search Bar & Filter Controls Cluster */}
        <div className="shop-controls-cluster">
          {/* Search Bar */}
          <div className="shop-search-bar">
            <HiOutlineMagnifyingGlass size={18} className="shop-search-icon" />
            <input
              type="text"
              placeholder="Search model, material, titanium..."
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
                aria-label="Clear search"
              >
                <HiXMark size={16} />
              </button>
            )}
          </div>

          <button
            type="button"
            className={`shop-filter-toggle ${filtersDrawerOpen ? 'filter-active' : ''}`}
            onClick={() => setFiltersDrawerOpen(!filtersDrawerOpen)}
            aria-expanded={filtersDrawerOpen}
          >
            <HiAdjustmentsHorizontal size={17} />
            <span>Filters</span>
            {hasActiveFilters && <span className="filter-badge-dot" />}
          </button>

          <div className="shop-sort-wrapper">
            <label htmlFor="shop-sort-select" className="sr-only">Sort by</label>
            <select
              id="shop-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="shop-sort-select"
            >
              <option value="featured">Featured Order</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest Arrivals</option>
              <option value="popular">Popular</option>
            </select>
          </div>
        </div>
      </nav>

      {/* Expandable Sub-Filter Bar */}
      {filtersDrawerOpen && (
        <div className="shop-filters-drawer container-editorial">
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
                    onClick={() => setSelectedShape(shape)}
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
                    onClick={() => setSelectedMaterial(mat)}
                  >
                    {mat === 'all' ? 'All Materials' : mat}
                  </button>
                ))}
              </div>
            </div>

            {/* Reset Action */}
            {hasActiveFilters && (
              <div className="filter-reset-col">
                <button type="button" onClick={resetFilters} className="btn-editorial-outline btn-sm">
                  <span>Reset All</span>
                  <HiXMark size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Product Grid Area */}
      <main className="shop-grid-section container-editorial">
        <div className="shop-count-bar">
          <span className="shop-count-text">
            {isLoading ? (
              'Loading editions…'
            ) : (
              <>
                Showing{' '}
                <strong className="count-number">{products.length}</strong> of{' '}
                {pagination.total} Editions
              </>
            )}
          </span>
          {hasActiveFilters && !isLoading && (
            <button type="button" onClick={resetFilters} className="clear-all-link">
              Clear All Filters
            </button>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="shop-loading-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="product-skeleton">
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
            <span className="editorial-eyebrow">Connection Error</span>
            <h3 className="empty-title">UNABLE TO LOAD ARCHIVE</h3>
            <p className="editorial-body empty-desc">{error}</p>
            <button type="button" onClick={loadProducts} className="btn-editorial">
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* Products Grid */}
        {!isLoading && !error && products.length > 0 && (
          <>
            <div className="shop-editorial-grid">
              {products.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="shop-pagination">
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
                      // Show first, last, current, and adjacent pages
                      return p === 1 || p === pagination.totalPages || Math.abs(p - pagination.page) <= 1;
                    })
                    .map((p, idx, arr) => (
                      <span key={p}>
                        {idx > 0 && arr[idx - 1] !== p - 1 && (
                          <span className="pagination-ellipsis">…</span>
                        )}
                        <button
                          type="button"
                          className={`pagination-num ${pagination.page === p ? 'page-active' : ''}`}
                          onClick={() => handlePageChange(p)}
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
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!isLoading && !error && products.length === 0 && (
          <div className="shop-empty-state">
            <span className="editorial-eyebrow">Zero Matches</span>
            <h3 className="empty-title">NO FRAMES MATCH YOUR CRITERIA</h3>
            <p className="editorial-body empty-desc">
              Try adjusting your shape, material, or keyword filters to explore other
              architectural editions from our archive.
            </p>
            <button type="button" onClick={resetFilters} className="btn-editorial">
              <span>View Full Archive</span>
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
