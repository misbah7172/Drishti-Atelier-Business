import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { HiOutlineArrowLeft } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import api from '../../../services/api';
import './EditProduct.css';

export default function AddProduct() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [saving, setSaving] = useState(false);

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
    new_arrival: true,
    short_description: '',
    description: '',
  });

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

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
      const res = await api.post('/admin/products', formData);
      toast.success('Product created! You can now add images.');
      const newId = res.data.data?.id;
      if (newId) {
        navigate(`/admin/products/${newId}`);
      } else {
        navigate('/admin/products');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create product');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-page edit-product-page">
      <div className="edit-product-header">
        <div className="header-breadcrumbs">
          <Link to="/admin/products" className="back-link">
            <HiOutlineArrowLeft size={16} /> Back to Products
          </Link>
          <h1 className="admin-page-title">Add New Product</h1>
          <p className="admin-page-subtitle">Create a new eyewear model and configure its specifications</p>
        </div>
        <div className="header-actions">
          <button type="submit" form="add-product-form" className="admin-btn-primary" disabled={saving}>
            {saving ? 'Creating...' : 'Create & Continue to Images'}
          </button>
        </div>
      </div>

      <div className="edit-product-layout" style={{ gridTemplateColumns: '1fr' }}>
        <form id="add-product-form" onSubmit={handleSubmit} className="edit-form-card">
          <div className="form-section">
            <h3 className="section-title">General Information</h3>
            <div className="form-grid-2">
              <div className="form-group span-2">
                <label className="form-label">Product Name *</label>
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  placeholder="e.g. Ray-Ban Wayfarer RB2140"
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
                  placeholder="e.g. RB2140 or A2406"
                  value={formData.sku}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Brand</label>
                <input
                  type="text"
                  name="brand"
                  className="form-input"
                  placeholder="e.g. Ray-Ban, Oakley, Dior"
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

          <div className="form-section">
            <h3 className="section-title">Pricing & Inventory</h3>
            <div className="form-grid-3">
              <div className="form-group">
                <label className="form-label">Price (৳) *</label>
                <input
                  type="number"
                  step="0.01"
                  name="price"
                  className="form-input"
                  placeholder="0.00"
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
                  placeholder="0.00"
                  value={formData.compare_price}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Initial Stock</label>
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

          <div className="form-section">
            <h3 className="section-title">Frame Specifications</h3>
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Size / Dimensions</label>
                <input
                  type="text"
                  name="size"
                  className="form-input"
                  placeholder="e.g. 54-19-147"
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
                  placeholder="e.g. Black, Tiger Black, Gold"
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
                  placeholder="e.g. Acetate, Titanium, Wood"
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

          <div className="form-section">
            <h3 className="section-title">Description</h3>
            <div className="form-group">
              <label className="form-label">Short Description</label>
              <input
                type="text"
                name="short_description"
                className="form-input"
                placeholder="Brief summary for cards"
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
                placeholder="Detailed specifications, features, and care instructions"
                value={formData.description}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">Status & Marketing</h3>
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Status</label>
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
    </div>
  );
}
