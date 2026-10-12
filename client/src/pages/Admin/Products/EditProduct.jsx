import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  HiOutlineArrowLeft,
  HiOutlineCheck,
  HiOutlinePhoto,
  HiOutlineArrowUpTray,
  HiOutlineTrash,
  HiOutlineStar,
  HiStar,
  HiOutlineLink,
  HiOutlineDocumentDuplicate,
} from 'react-icons/hi2';
import toast from 'react-hot-toast';
import api from '../../../services/api';
import './EditProduct.css';

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [addingUrl, setAddingUrl] = useState(false);
  const [copiedSku, setCopiedSku] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    brand: '',
    category_id: '',
    gender: 'unisex',
    price: '',
    compare_price: '',
    stock: 1,
    size: '',
    frame_color: '',
    frame_material: '',
    frame_shape: '',
    status: 'active',
    featured: false,
    bestseller: false,
    new_arrival: false,
    short_description: '',
    description: '',
  });

  // Fetch Categories
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

  // Fetch Product Data
  const loadProduct = async () => {
    setLoading(true);
    try {
      let res;
      try {
        res = await api.get(`/admin/products/${id}`);
      } catch {
        res = await api.get(`/products/${id}`);
      }

      const p = res.data.data;
      setFormData({
        name: p.name || '',
        sku: p.sku || '',
        brand: p.brand || '',
        category_id: p.category_id || '',
        gender: p.gender || 'unisex',
        price: p.price || '',
        compare_price: p.compare_price || '',
        stock: p.stock ?? 1,
        size: p.size || '',
        frame_color: p.frame_color || '',
        frame_material: p.frame_material || '',
        frame_shape: p.frame_shape || '',
        status: p.status || 'active',
        featured: Boolean(p.featured),
        bestseller: Boolean(p.bestseller),
        new_arrival: Boolean(p.new_arrival),
        short_description: p.short_description || '',
        description: p.description || '',
      });
      setImages(p.images || []);
    } catch (err) {
      console.error('Failed to load product:', err);
      toast.error('Could not load product details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadProduct();
    }
  }, [id]);

  // Handle Form Change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Submit Product Updates
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Product name is required');
      return;
    }
    if (!formData.price || parseFloat(formData.price) < 0) {
      toast.error('Valid price is required');
      return;
    }

    setSaving(true);
    try {
      await api.put(`/admin/products/${id}`, formData);
      toast.success('Product updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update product');
    } finally {
      setSaving(false);
    }
  };

  // Copy SKU
  const handleCopySku = () => {
    if (formData.sku) {
      navigator.clipboard.writeText(formData.sku);
      setCopiedSku(true);
      toast.success(`Copied Model No: ${formData.sku}`);
      setTimeout(() => setCopiedSku(false), 2000);
    }
  };

  // Image Management
  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const data = new FormData();
    files.forEach((file) => data.append('images', file));

    setUploading(true);
    const toastId = toast.loading(`Uploading ${files.length} image(s)...`);

    try {
      await api.post(`/admin/products/${id}/images`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Images uploaded successfully!', { id: toastId });
      await loadProduct();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload images', { id: toastId });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleAddUrl = async (e) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    setAddingUrl(true);
    try {
      await api.post(`/admin/products/${id}/images/url`, {
        imageUrl: urlInput.trim(),
        alt_text: `${formData.brand} ${formData.sku}`,
      });
      toast.success('Image URL attached successfully!');
      setUrlInput('');
      await loadProduct();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add image URL');
    } finally {
      setAddingUrl(false);
    }
  };

  const handleSetPrimary = async (imageId) => {
    try {
      await api.put(`/admin/products/${id}/images/${imageId}/primary`);
      toast.success('Primary image updated!');
      await loadProduct();
    } catch (err) {
      toast.error('Failed to set primary image');
    }
  };

  const handleDeleteImage = async (imageId) => {
    try {
      await api.delete(`/admin/products/${id}/images/${imageId}`);
      toast.success('Image removed');
      await loadProduct();
    } catch (err) {
      toast.error('Failed to remove image');
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="edit-loading-state">Loading product details...</div>
      </div>
    );
  }

  return (
    <div className="admin-page edit-product-page">
      {/* Top Header */}
      <div className="edit-product-header">
        <div className="header-breadcrumbs">
          <Link to="/admin/products" className="back-link">
            <HiOutlineArrowLeft size={16} /> Back to Products
          </Link>
          <div className="header-title-row">
            <h1 className="admin-page-title">Edit Product</h1>
            <button
              type="button"
              className="sku-header-badge"
              onClick={handleCopySku}
              title="Click to copy Model Number"
            >
              Model No: <strong>{formData.sku || 'N/A'}</strong>
              {copiedSku ? <HiOutlineCheck size={13} color="#22c55e" /> : <HiOutlineDocumentDuplicate size={13} />}
            </button>
          </div>
          <p className="admin-page-subtitle">
            Update model information, frame specifications, and manage product images
          </p>
        </div>

        <div className="header-actions">
          <button type="submit" form="edit-product-form" className="admin-btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="edit-product-layout">
        {/* Main Form Column */}
        <div className="edit-form-column">
          <form id="edit-product-form" onSubmit={handleSubmit} className="edit-form-card">
            {/* Section 1: Basic Information */}
            <div className="form-section">
              <h3 className="section-title">General Information</h3>
              <div className="form-grid-2">
                <div className="form-group span-2">
                  <label className="form-label">Product Name *</label>
                  <input
                    type="text"
                    name="name"
                    className="form-input"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Model No / SKU *</label>
                  <input
                    type="text"
                    name="sku"
                    className="form-input mono"
                    value={formData.sku}
                    onChange={handleChange}
                    required
                  />
                  <span className="field-hint">Used for searching and image association</span>
                </div>

                <div className="form-group">
                  <label className="form-label">Brand</label>
                  <input
                    type="text"
                    name="brand"
                    className="form-input"
                    value={formData.brand}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    name="category_id"
                    className="form-select"
                    value={formData.category_id}
                    onChange={handleChange}
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Gender</label>
                  <select name="gender" className="form-select" value={formData.gender} onChange={handleChange}>
                    <option value="unisex">Unisex</option>
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                    <option value="kids">Kids</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2: Pricing & Stock */}
            <div className="form-section">
              <h3 className="section-title">Pricing & Stock</h3>
              <div className="form-grid-3">
                <div className="form-group">
                  <label className="form-label">Price (৳) *</label>
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    className="form-input"
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Compare Price (৳)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="compare_price"
                    className="form-input"
                    value={formData.compare_price}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Stock Quantity</label>
                  <input
                    type="number"
                    name="stock"
                    className="form-input"
                    value={formData.stock}
                    onChange={handleChange}
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Frame Specifications */}
            <div className="form-section">
              <h3 className="section-title">Frame Specifications</h3>
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Size / Dimensions</label>
                  <input
                    type="text"
                    name="size"
                    className="form-input"
                    placeholder="e.g. 54-19-147 or Standard"
                    value={formData.size}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Frame Color</label>
                  <input
                    type="text"
                    name="frame_color"
                    className="form-input"
                    placeholder="e.g. Tiger Black, Matte Gold"
                    value={formData.frame_color}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Frame Material</label>
                  <input
                    type="text"
                    name="frame_material"
                    className="form-input"
                    placeholder="e.g. Handcrafted Acetate, Titanium"
                    value={formData.frame_material}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Frame Shape</label>
                  <input
                    type="text"
                    name="frame_shape"
                    className="form-input"
                    placeholder="e.g. Rectangle, Round, Aviator"
                    value={formData.frame_shape}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Descriptions */}
            <div className="form-section">
              <h3 className="section-title">Descriptions</h3>
              <div className="form-group">
                <label className="form-label">Short Description</label>
                <input
                  type="text"
                  name="short_description"
                  className="form-input"
                  value={formData.short_description}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group" style={{ marginTop: '0.85rem' }}>
                <label className="form-label">Full Description</label>
                <textarea
                  name="description"
                  className="form-textarea"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Section 5: Status & Badges */}
            <div className="form-section">
              <h3 className="section-title">Status & Visibility</h3>
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Catalog Status</label>
                  <select name="status" className="form-select" value={formData.status} onChange={handleChange}>
                    <option value="active">Active (Visible)</option>
                    <option value="draft">Draft</option>
                    <option value="out_of_stock">Out of Stock</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div className="checkboxes-row">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                  />
                  <span>Featured Collection</span>
                </label>

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="bestseller"
                    checked={formData.bestseller}
                    onChange={handleChange}
                  />
                  <span>Bestseller</span>
                </label>

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="new_arrival"
                    checked={formData.new_arrival}
                    onChange={handleChange}
                  />
                  <span>New Arrival</span>
                </label>
              </div>
            </div>
          </form>
        </div>

        {/* Sidebar Column: Image Gallery Management */}
        <div className="edit-gallery-column">
          <div className="gallery-card">
            <div className="gallery-card-header">
              <div className="gallery-header-left">
                <HiOutlinePhoto size={18} color="#F97D01" />
                <h3 className="gallery-title">Product Images</h3>
              </div>
              <span className="gallery-count-pill">{images.length} images</span>
            </div>

            {/* Current Images List */}
            <div className="gallery-items-wrap">
              {images.length === 0 ? (
                <div className="gallery-empty-box">
                  <HiOutlinePhoto size={36} color="#9CA3AF" />
                  <h4>No images attached</h4>
                  <p>Upload photos or attach a direct image URL below</p>
                </div>
              ) : (
                <div className="gallery-items-grid">
                  {images.map((img) => (
                    <div key={img.id} className={`gallery-item ${img.is_primary ? 'is-primary' : ''}`}>
                      <img src={img.image_url} alt="" className="gallery-thumb" />
                      <div className="gallery-item-bar">
                        {img.is_primary ? (
                          <span className="primary-tag">
                            <HiStar size={12} /> Primary
                          </span>
                        ) : (
                          <button
                            type="button"
                            className="btn-make-primary"
                            onClick={() => handleSetPrimary(img.id)}
                          >
                            Set Primary
                          </button>
                        )}
                        <button
                          type="button"
                          className="btn-delete-img"
                          onClick={() => handleDeleteImage(img.id)}
                          title="Remove image"
                        >
                          <HiOutlineTrash size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Upload Files */}
            <div className="gallery-upload-box">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/png,image/jpeg,image/webp,image/jpg"
                style={{ display: 'none' }}
                onChange={handleFileUpload}
                disabled={uploading}
              />
              <button
                type="button"
                className="upload-drop-trigger"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                <HiOutlineArrowUpTray size={20} />
                <span>{uploading ? 'Uploading...' : 'Upload Image Files'}</span>
                <small>PNG, JPG, WEBP</small>
              </button>
            </div>

            {/* Attach via URL */}
            <div className="gallery-url-box">
              <label className="form-label" style={{ fontSize: '0.75rem' }}>
                <HiOutlineLink size={13} /> Attach by Direct URL
              </label>
              <form onSubmit={handleAddUrl} className="url-row">
                <input
                  type="url"
                  className="form-input"
                  placeholder="https://..."
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  disabled={addingUrl}
                />
                <button type="submit" className="admin-btn-sm" disabled={addingUrl || !urlInput.trim()}>
                  {addingUrl ? '...' : 'Add'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
