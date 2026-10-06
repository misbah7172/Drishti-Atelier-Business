import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  HiOutlinePlus,
  HiOutlineTrash,
  HiOutlinePencil,
  HiCheck,
  HiXMark,
  HiArrowLeft,
} from 'react-icons/hi2';
import toast from 'react-hot-toast';
import api from '../../../services/api';
import './Addresses.css';

export default function Addresses() {
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    label: 'Home',
    full_name: '',
    phone: '',
    address: '',
    city: '',
    area: '',
    postal_code: '',
    is_default: false,
  });
  const [saving, setSaving] = useState(false);

  const fetchAddresses = async () => {
    try {
      const res = await api.get('/addresses');
      setAddresses(res.data.data || []);
    } catch (err) {
      console.error('Addresses fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const resetForm = () => {
    setForm({
      label: 'Home',
      full_name: '',
      phone: '',
      address: '',
      city: '',
      area: '',
      postal_code: '',
      is_default: false,
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (addr) => {
    setForm({
      label: addr.label || 'Home',
      full_name: addr.full_name,
      phone: addr.phone,
      address: addr.address,
      city: addr.city,
      area: addr.area || '',
      postal_code: addr.postal_code || '',
      is_default: addr.is_default,
    });
    setEditingId(addr.id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.full_name || !form.phone || !form.address || !form.city) {
      toast.error('Please fill required fields (Name, Phone, Address, City)');
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        await api.put(`/addresses/${editingId}`, form);
        toast.success('Address updated successfully');
      } else {
        await api.post('/addresses', form);
        toast.success('Address added successfully');
      }
      resetForm();
      fetchAddresses();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save address');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this delivery address?')) return;
    try {
      await api.delete(`/addresses/${id}`);
      toast.success('Address removed');
      fetchAddresses();
    } catch (err) {
      toast.error('Failed to remove address');
    }
  };

  return (
    <div className="addresses-page" id="addresses-view">
      <div className="addresses-container">
        <Link to="/account" className="addresses-back-link">
          <HiArrowLeft size={14} />
          <span>Back to Account</span>
        </Link>

        <header className="addresses-header">
          <div>
            <span className="editorial-eyebrow">Your Account</span>
            <h1 className="addresses-title">SAVED ADDRESSES</h1>
          </div>
          {!showForm && (
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="btn-editorial btn-sm"
            >
              <HiOutlinePlus size={16} />
              <span>Add Address</span>
            </button>
          )}
        </header>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="address-form-card">
            <div className="address-form-header">
              <h2 className="address-form-title">
                {editingId ? 'Edit Delivery Address' : 'New Delivery Address'}
              </h2>
              <button
                type="button"
                onClick={resetForm}
                className="address-close-btn"
                aria-label="Close form"
              >
                <HiXMark size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="address-form-grid">
              <div className="form-group">
                <label className="form-label">Address Label</label>
                <select
                  value={form.label}
                  onChange={(e) => setForm((p) => ({ ...p, label: e.target.value }))}
                  className="form-input"
                >
                  <option value="Home">Home</option>
                  <option value="Office">Office</option>
                  <option value="Residence">Residence</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  value={form.full_name}
                  onChange={(e) => setForm((p) => ({ ...p, full_name: e.target.value }))}
                  className="form-input"
                  placeholder="Recipient full name"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                  className="form-input"
                  placeholder="+880 1XXXXXXXXX"
                />
              </div>

              <div className="form-group">
                <label className="form-label">City *</label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
                  className="form-input"
                  placeholder="e.g. Dhaka"
                />
              </div>

              <div className="form-group form-full-width">
                <label className="form-label">Street Address *</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
                  className="form-input"
                  placeholder="House, road, apartment, suite"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Area / Thana</label>
                <input
                  type="text"
                  value={form.area}
                  onChange={(e) => setForm((p) => ({ ...p, area: e.target.value }))}
                  className="form-input"
                  placeholder="e.g. Gulshan, Banani"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Postal Code</label>
                <input
                  type="text"
                  value={form.postal_code}
                  onChange={(e) => setForm((p) => ({ ...p, postal_code: e.target.value }))}
                  className="form-input"
                  placeholder="e.g. 1212"
                />
              </div>

              <div className="form-group form-checkbox-row form-full-width">
                <label className="form-checkbox-label">
                  <input
                    type="checkbox"
                    checked={form.is_default}
                    onChange={(e) => setForm((p) => ({ ...p, is_default: e.target.checked }))}
                  />
                  <span>Set as default delivery address</span>
                </label>
              </div>

              <div className="form-group form-full-width address-form-actions">
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-editorial btn-sm"
                >
                  <HiCheck size={16} />
                  <span>{saving ? 'Saving...' : editingId ? 'Update Address' : 'Save Address'}</span>
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn-editorial-outline btn-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Address List */}
        {isLoading ? (
          <div className="addresses-loading">
            {[1, 2].map((i) => (
              <div key={i} className="address-skeleton" />
            ))}
          </div>
        ) : addresses.length === 0 && !showForm ? (
          <div className="addresses-empty">
            <p className="editorial-body">
              No saved addresses yet. Add one to expedite your bespoke checkout.
            </p>
          </div>
        ) : (
          <div className="addresses-grid">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className={`address-card ${addr.is_default ? 'address-default' : ''}`}
              >
                <div className="address-card-top">
                  <span className="address-label">{addr.label || 'Home'}</span>
                  {addr.is_default && (
                    <span className="address-default-badge">Default</span>
                  )}
                </div>
                <h3 className="address-name">{addr.full_name}</h3>
                <p className="address-line">{addr.address}</p>
                <p className="address-line">
                  {addr.area && `${addr.area}, `}{addr.city}
                  {addr.postal_code && ` - ${addr.postal_code}`}
                </p>
                <p className="address-phone">{addr.phone}</p>
                <div className="address-card-actions">
                  <button
                    type="button"
                    onClick={() => handleEdit(addr)}
                    className="address-action-btn"
                  >
                    <HiOutlinePencil size={14} /> <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(addr.id)}
                    className="address-action-btn address-delete-btn"
                  >
                    <HiOutlineTrash size={14} /> <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
