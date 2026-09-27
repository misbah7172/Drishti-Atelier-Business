import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { HiOutlineMagnifyingGlass, HiXMark, HiAdjustmentsHorizontal } from 'react-icons/hi2';
import ProductCard from '../../components/ProductCard/ProductCard';
import { PRODUCTS, getFilteredProducts } from '../../services/productData';
import './Shop.css';

const CATEGORIES = [
  { id: 'all', label: 'All Editions' },
  { id: 'sunglasses', label: 'Sunglasses' },
  { id: 'prescription-glasses', label: 'Optical' },
  { id: 'blue-light-glasses', label: 'Blue Light' },
];

const SHAPES = ['all', 'Aviator', 'Rectangle', 'Round', 'Statement'];
const MATERIALS = ['all', 'Titanium', 'Acetate', 'Metal'];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL state synchronization
  const activeCategory = searchParams.get('category') || 'all';
  const searchParam = searchParams.get('search') || '';

  const [selectedShape, setSelectedShape] = useState('all');
  const [selectedMaterial, setSelectedMaterial] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [searchQuery, setSearchQuery] = useState(searchParam);
  const [filtersDrawerOpen, setFiltersDrawerOpen] = useState(false);

  const handleCategoryChange = (catId) => {
    const newParams = new URLSearchParams(searchParams);
    if (catId === 'all') {
      newParams.delete('category');
    } else {
      newParams.set('category', catId);
    }
    setSearchParams(newParams);
  };

  const resetFilters = () => {
    setSelectedShape('all');
    setSelectedMaterial('all');
    setSortBy('featured');
    setSearchQuery('');
    setSearchParams({});
  };

  const filteredProducts = useMemo(() => {
    return getFilteredProducts({
      category: activeCategory,
      shape: selectedShape,
      material: selectedMaterial,
      search: searchQuery,
      sort: sortBy,
    });
  }, [activeCategory, selectedShape, selectedMaterial, searchQuery, sortBy]);

  const hasActiveFilters =
    activeCategory !== 'all' ||
    selectedShape !== 'all' ||
    selectedMaterial !== 'all' ||
    Boolean(searchQuery.trim());

  return (
    <div className="shop-page" id="shop-catalog">
      {/* Editorial Header */}
      <header className="shop-header container-editorial">
        <div className="shop-header-intro">
          <span className="editorial-eyebrow">Collection 2026 — Atelier Archive</span>
          <h1 className="editorial-section-title shop-title">
            THE ARCHIVE <br />
            <span className="text-muted-editorial">ARCHITECTURAL EYEWEAR.</span>
          </h1>
          <p className="editorial-body shop-desc">
            Sculpted in Japanese aerospace titanium and hand-buffed acetate. Every
            silhouette engineered to balance weight distribution and crystalline optics.
          </p>
        </div>

        {/* Search Bar */}
        <div className="shop-search-bar">
          <HiOutlineMagnifyingGlass size={18} className="shop-search-icon" />
          <input
            type="text"
            placeholder="Search by model, material, titanium, acetate..."
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
      </header>

      {/* Primary Category Nav */}
      <nav className="shop-category-nav container-editorial" aria-label="Product categories">
        <div className="category-pills">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`shop-category-btn ${activeCategory === cat.id ? 'cat-active' : ''}`}
              onClick={() => handleCategoryChange(cat.id)}
            >
              <span>{cat.label}</span>
              {activeCategory === cat.id && <span className="cat-active-line" aria-hidden="true" />}
            </button>
          ))}
        </div>

        {/* Secondary Filter Trigger & Sorter */}
        <div className="shop-controls-cluster">
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
            Showing <strong className="count-number">{filteredProducts.length}</strong> of{' '}
            {PRODUCTS.length} Editions
          </span>
          {hasActiveFilters && (
            <button type="button" onClick={resetFilters} className="clear-all-link">
              Clear All Filters
            </button>
          )}
        </div>

        {filteredProducts.length > 0 ? (
          <div className="shop-editorial-grid">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        ) : (
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
