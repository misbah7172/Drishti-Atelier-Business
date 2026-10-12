import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlinePhoto,
  HiOutlineMagnifyingGlass,
  HiXMark,
  HiOutlineFunnel,
  HiOutlineDocumentDuplicate,
  HiOutlineCheck,
} from 'react-icons/hi2';
import toast from 'react-hot-toast';
import api from '../../../services/api';
import ProductImageModal from './ProductImageModal';
import '../AdminManagement.css';
import './ManageProducts.css';

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [search, setSearch] = useState('');
  const [imageFilter, setImageFilter] = useState('all'); // 'all', 'missing', 'has'
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [activeImageProduct, setActiveImageProduct] = useState(null);
  const [copiedSku, setCopiedSku] = useState(null);

  // Fetch Categories for filter dropdown
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await api.get('/admin/categories');
        setCategories(res.data.data || []);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    }
    loadCategories();
  }, []);

  // Fetch Products
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const p = new URLSearchParams({
        page,
        limit,
        status: 'all', // Show all statuses in admin
      });

      if (search.trim()) p.set('search', search.trim());
      if (categoryFilter !== 'all') p.set('category', categoryFilter);
      if (imageFilter === 'missing') p.set('has_images', 'false');
      if (imageFilter === 'has') p.set('has_images', 'true');

      const res = await api.get(`/admin/products?${p}`);
      const data = res.data.data;
      setProducts(data.products || []);
      setTotal(data.pagination?.total || data.total || 0);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (err) {
      console.error('Failed to load products:', err);
      toast.error('Could not load products');
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, categoryFilter, imageFilter]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 280);
    return () => clearTimeout(timer);
  }, [fetchProducts]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const handleClearSearch = () => {
    setSearch('');
    setPage(1);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/admin/products/${deleteTarget.id}`);
      toast.success('Product deleted successfully');
      setDeleteTarget(null);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete product');
    }
  };

  const copyToClipboard = (sku) => {
    if (!sku) return;
    navigator.clipboard.writeText(sku);
    setCopiedSku(sku);
    toast.success(`Copied Model No: ${sku}`);
    setTimeout(() => setCopiedSku(null), 1800);
  };

  return (
    <div className="admin-page" id="admin-products-view">
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Products & Inventory</h1>
          <p className="admin-page-subtitle">
            {total} items in catalog • Search by Model No to attach high-res images
          </p>
        </div>
        <Link to="/admin/products/new" className="admin-btn-primary">
          <HiOutlinePlus size={16} /> Add Product
        </Link>
      </div>

      {/* Model Number Search & Filter Toolbar */}
      <div className="admin-products-toolbar">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="search-form-wrap">
          <HiOutlineMagnifyingGlass className="search-icon" size={17} />
          <input
            type="text"
            className="model-search-input"
            placeholder="Search Model No (e.g. 1181, A2406, OO9528), Brand, SKU..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          {search && (
            <button type="button" className="clear-search-btn" onClick={handleClearSearch} title="Clear search">
              <HiXMark size={16} />
            </button>
          )}
        </form>

        {/* Filter Pills */}
        <div className="filter-pills-group">
          <button
            type="button"
            className={`pill-btn ${imageFilter === 'all' ? 'active' : ''}`}
            onClick={() => {
              setImageFilter('all');
              setPage(1);
            }}
          >
            All Items
          </button>
          <button
            type="button"
            className={`pill-btn pill-warning ${imageFilter === 'missing' ? 'active' : ''}`}
            onClick={() => {
              setImageFilter('missing');
              setPage(1);
            }}
          >
            ⚠️ Needs Images
          </button>
          <button
            type="button"
            className={`pill-btn pill-success ${imageFilter === 'has' ? 'active' : ''}`}
            onClick={() => {
              setImageFilter('has');
              setPage(1);
            }}
          >
            📷 Has Images
          </button>
        </div>

        {/* Category Dropdown */}
        <div className="filter-dropdown-wrap">
          <HiOutlineFunnel size={14} className="dropdown-icon" />
          <select
            className="category-filter-select"
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Search Feedback Summary */}
      {search && (
        <div className="search-feedback-banner">
          <span>
            Filtering by query: <strong>"{search}"</strong> — Found {total} matching product(s)
          </span>
          <button type="button" onClick={handleClearSearch} className="feedback-reset-btn">
            Clear Filter
          </button>
        </div>
      )}

      {/* Products Table */}
      <div className="admin-table-wrap">
        <table className="admin-mgmt-table products-table">
          <thead>
            <tr>
              <th>Product / Brand</th>
              <th>Model No (SKU)</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Images</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="table-empty">
                  Loading catalog...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={7} className="table-empty">
                  <div className="empty-search-state">
                    <HiOutlinePhoto size={36} color="#9CA3AF" />
                    <p>No products found matching your search</p>
                    {search && (
                      <button type="button" onClick={handleClearSearch} className="admin-btn-sm">
                        Reset Search
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              products.map((p) => {
                const imgCount = parseInt(p.image_count) || 0;
                return (
                  <tr key={p.id}>
                    {/* Product & Brand */}
                    <td>
                      <div className="prod-cell-wrap">
                        {p.primary_image ? (
                          <img src={p.primary_image} alt="" className="prod-thumb" />
                        ) : (
                          <div className="prod-thumb-placeholder" title="No image uploaded yet">
                            <HiOutlinePhoto size={18} />
                          </div>
                        )}
                        <div>
                          <div className="prod-title">{p.name}</div>
                          <div className="prod-brand-sub">{p.brand || 'Drishti Atelier'}</div>
                        </div>
                      </div>
                    </td>

                    {/* Model No / SKU */}
                    <td>
                      <button
                        type="button"
                        className="sku-copy-pill"
                        onClick={() => copyToClipboard(p.sku)}
                        title="Click to copy Model Number"
                      >
                        <code>{p.sku || '—'}</code>
                        {copiedSku === p.sku ? (
                          <HiOutlineCheck size={12} color="#16a34a" />
                        ) : (
                          <HiOutlineDocumentDuplicate size={12} className="copy-icon" />
                        )}
                      </button>
                    </td>

                    {/* Price */}
                    <td>
                      <div className="prod-price-text">৳{parseFloat(p.price).toLocaleString()}</div>
                      {p.compare_price && parseFloat(p.compare_price) > parseFloat(p.price) && (
                        <div className="prod-compare-price">৳{parseFloat(p.compare_price).toLocaleString()}</div>
                      )}
                    </td>

                    {/* Stock */}
                    <td>
                      <span className={`stock-pill ${p.stock <= 0 ? 'out' : p.stock <= 2 ? 'low' : 'ok'}`}>
                        {p.stock} pcs
                      </span>
                    </td>

                    {/* Images Column with Instant Add Button */}
                    <td>
                      {imgCount === 0 ? (
                        <button
                          type="button"
                          className="image-badge-missing"
                          onClick={() => setActiveImageProduct(p)}
                          title="Click to upload images for this model"
                        >
                          <HiOutlinePhoto size={13} />
                          <span>0 Images</span>
                          <span className="add-tag">+ Add</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="image-badge-has"
                          onClick={() => setActiveImageProduct(p)}
                          title="Click to view/manage attached images"
                        >
                          <HiOutlinePhoto size={13} />
                          <span>{imgCount} Image{imgCount > 1 ? 's' : ''}</span>
                        </button>
                      )}
                    </td>

                    {/* Status */}
                    <td>
                      <span className={`badge badge-${p.status === 'active' ? 'active' : 'inactive'}`}>
                        {p.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="admin-actions">
                      <button
                        type="button"
                        className="admin-btn-sm btn-quick-image"
                        onClick={() => setActiveImageProduct(p)}
                        title="Upload/manage images by Model No"
                      >
                        <HiOutlinePhoto size={14} /> Images
                      </button>
                      <Link to={`/admin/products/${p.id}`} className="admin-btn-sm" title="Edit full product details">
                        <HiOutlinePencil size={13} /> Edit
                      </Link>
                      <button
                        type="button"
                        className="admin-btn-sm admin-btn-danger"
                        onClick={() => setDeleteTarget(p)}
                        title="Delete product"
                      >
                        <HiOutlineTrash size={13} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="admin-pagination-bar">
        <div className="pagination-info">
          Showing {products.length > 0 ? (page - 1) * limit + 1 : 0} to{' '}
          {Math.min(page * limit, total)} of {total} products
        </div>
        <div className="pagination-controls">
          <button
            type="button"
            className="admin-btn-sm"
            disabled={page <= 1}
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          >
            Previous
          </button>
          <span className="page-indicator">
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            className="admin-btn-sm"
            disabled={page >= totalPages}
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
          >
            Next
          </button>
        </div>
      </div>

      {/* Quick Image Upload Modal */}
      {activeImageProduct && (
        <ProductImageModal
          product={activeImageProduct}
          isOpen={Boolean(activeImageProduct)}
          onClose={() => setActiveImageProduct(null)}
          onProductUpdated={fetchProducts}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="admin-modal-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="admin-modal confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <h2 className="admin-modal-title">Delete Product</h2>
            <p className="confirm-message">
              Are you sure you want to delete <strong>{deleteTarget.name}</strong> (Model: {deleteTarget.sku})? This cannot be undone.
            </p>
            <div className="confirm-actions">
              <button type="button" className="admin-btn-cancel" onClick={() => setDeleteTarget(null)}>
                Cancel
              </button>
              <button type="button" className="confirm-btn-danger" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
