import { useState, useEffect } from 'react';
import { HiOutlinePlus, HiOutlineTrash, HiOutlinePencil, HiCheck, HiXMark } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import api from '../../../services/api';
import './Addresses.css';

export default function Addresses() {
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    label: 'Home', full_name: '', phone: '', address: '', city: '', area: '', postal_code: '', is_default: false,
  });
  const [saving, setSaving] = useState(false);

  const fetchAddresses = async () => {
    try {
      const res = await api.get('/addresses');
      setAddresses(res.data.data);
    } catch (err) {
      console.error('Addresses fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchAddresses(); }, []);

  const resetForm = () => {
    setForm({ label: 'Home', full_name: '', phone: '', address: '', city: '', area: '', postal_code: '', is_default: false });
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
      toast.error('Please fill required fields', { style: { background: '#070707', color: '#fff', border: '1px solid #222' } });
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        await api.put(`/addresses/${editingId}`, form);
        toast.success('Address updated', { style: { background: '#070707', color: '#fff', border: '1px solid #222' } });
      } else {
        await api.post('/addresses', form);
        toast.success('Address added', { style: { background: '#070707', color: '#fff', border: '1px solid #222' } });
      }
      resetForm();
      fetchAddresses();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed', { style: { background: '#070707', color: '#fff', border: '1px solid #222' } });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/addresses/${id}`);
      toast.success('Address deleted', { style: { background: '#070707', color: '#fff', border: '1px solid #222' } });
      fetchAddresses();
    } catch (err) {
      toast.error('Failed to delete', { style: { background: '#070707', color: '#fff', border: '1px solid #222' } });
    }
  };

  return (
    <div className="addresses-page" id="addresses-view">
      <div className="container-editorial addresses-container">
        <header className="addresses-header">
          <div>
            <span className="editorial-eyebrow">Your Account</span>
            <h1 className="editorial-section-title">SAVED ADDRESSES</h1>
          </div>
          {!showForm && (
            <button type="button" onClick={() => setShowForm(true)} className="btn-editorial btn-sm">
              <HiOutlinePlus size={16} />
              <span>Add Address</span>
            </button>
          )}
        </header>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="address-form-card">
            <div className="address-form-header">
              <h2 className="address-form-title">{editingId ? 'EDIT ADDRESS' : 'NEW ADDRESS'}</h2>
              <button type="button" onClick={resetForm} className="address-close-btn">
                <HiXMark size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="address-form-grid">
              <div className="form-group">
                <label className="form-label">Label</label>
                <select
                  value={form.label} onChange={(e) => setForm((p) => ({ ...p, label: e.target.value }))}
                  className="form-input"
                >
                  <option value="Home">Home</option>
                  <option value="Office">Office</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input type="text" value={form.full_name} onChange={(e) => setForm((p) => ({ ...p, full_name: e.target.value }))} className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Phone *</label>
                <input type="tel" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} className="form-input" />
              </div>
              <div className="form-group form-full">
                <label className="form-label">Address *</label>
                <input type="text" value={form.address} onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))} className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">City *</label>
                <input type="text" value={form.city} onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))} className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Area</label>
                <input type="text" value={form.area} onChange={(e) => setForm((p) => ({ ...p, area: e.target.value }))} className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Postal Code</label>
                <input type="text" value={form.postal_code} onChange={(e) => setForm((p) => ({ ...p, postal_code: e.target.value }))} className="form-input" />
              </div>
              <div className="form-group form-checkbox-row">
                <label className="form-checkbox-label">
                  <input type="checkbox" checked={form.is_default} onChange={(e) => setForm((p) => ({ ...p, is_default: e.target.checked }))} />
                  <span>Set as default address</span>
                </label>
              </div>
              <div className="form-group form-full">
                <button type="submit" disabled={saving} className="btn-editorial btn-sm">
                  <HiCheck size={16} />
                  <span>{saving ? 'Saving...' : editingId ? 'Update' : 'Save Address'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Address List */}
        {isLoading ? (
          <div className="addresses-loading">
            {[1, 2].map((i) => <div key={i} className="address-skeleton shimmer" />)}
          </div>
        ) : addresses.length === 0 && !showForm ? (
          <div className="addresses-empty">
            <p className="editorial-body">No saved addresses yet. Add one to speed up your checkout.</p>
          </div>
        ) : (
          <div className="addresses-grid">
            {addresses.map((addr) => (
              <div key={addr.id} className={`address-card ${addr.is_default ? 'address-default' : ''}`}>
                <div className="address-card-top">
                  <span className="address-label">{addr.label || 'Home'}</span>
                  {addr.is_default && <span className="address-default-badge">Default</span>}
                </div>
                <p className="address-name">{addr.full_name}</p>
                <p className="address-line">{addr.phone}</p>
                <p className="address-line">{addr.address}</p>
                <p className="address-line">
                  {addr.area && `${addr.area}, `}{addr.city}
                  {addr.postal_code && ` - ${addr.postal_code}`}
                </p>
                <div className="address-card-actions">
                  <button type="button" onClick={() => handleEdit(addr)} className="address-action-btn">
                    <HiOutlinePencil size={14} /> <span>Edit</span>
                  </button>
                  <button type="button" onClick={() => handleDelete(addr.id)} className="address-action-btn address-delete-btn">
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
