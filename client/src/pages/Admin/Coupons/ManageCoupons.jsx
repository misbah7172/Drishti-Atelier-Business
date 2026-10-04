import { useState, useEffect } from 'react';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiXMark } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import api from '../../../services/api';
import '../AdminManagement.css';

const EMPTY = { code: '', description: '', discount_type: 'percentage', discount_value: '', max_discount: '', min_order_amount: '', usage_limit: '', expires_at: '', is_active: true };

export default function ManageCoupons() {
  const [coupons, setCoupons] = useState([]); const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false); const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY); const [saving, setSaving] = useState(false); const [deleteTarget, setDeleteTarget] = useState(null);

  const fetch = async () => { try { const res = await api.get('/admin/coupons'); setCoupons(res.data.data); } catch (err) { console.error(err); } finally { setLoading(false); } };
  useEffect(() => { fetch(); }, []);

  const resetForm = () => { setForm(EMPTY); setEditingId(null); setShowForm(false); };
  const handleEdit = (c) => { setForm({ code: c.code, description: c.description || '', discount_type: c.discount_type, discount_value: c.discount_value, max_discount: c.max_discount || '', min_order_amount: c.min_order_amount || '', usage_limit: c.usage_limit || '', expires_at: c.expires_at ? c.expires_at.slice(0, 10) : '', is_active: c.is_active }); setEditingId(c.id); setShowForm(true); };
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault(); if (!form.code || !form.discount_value) return toast.error('Code and value required');
    setSaving(true);
    try {
      if (editingId) { await api.put(`/admin/coupons/${editingId}`, form); toast.success('Updated', { style: { background: '#070707', color: '#fff', border: '1px solid #222' } }); }
      else { await api.post('/admin/coupons', form); toast.success('Created', { style: { background: '#070707', color: '#fff', border: '1px solid #222' } }); }
      resetForm(); fetch();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); } finally { setSaving(false); }
  };

  const handleDelete = async () => { if (!deleteTarget) return; try { await api.delete(`/admin/coupons/${deleteTarget.id}`); toast.success('Deleted'); setDeleteTarget(null); fetch(); } catch { toast.error('Failed'); } };

  return (
    <div className="admin-page" id="admin-coupons-view">
      <div className="admin-page-header"><div><h1 className="admin-page-title">Coupons</h1><p className="admin-page-subtitle">{coupons.length} coupons</p></div>
        {!showForm && <button type="button" className="admin-btn-primary" onClick={() => setShowForm(true)}><HiOutlinePlus size={16} /> Add Coupon</button>}
      </div>

      {showForm && <div className="admin-modal-overlay" onClick={resetForm}><div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="admin-modal-close" onClick={resetForm}><HiXMark size={20} /></button>
        <h2 className="admin-modal-title">{editingId ? 'Edit Coupon' : 'New Coupon'}</h2>
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="admin-form-row">
            <div className="admin-form-group"><label className="admin-form-label">Code *</label><input className="admin-form-input" value={form.code} onChange={(e) => set('code', e.target.value)} style={{ textTransform: 'uppercase' }} /></div>
            <div className="admin-form-group"><label className="admin-form-label">Type</label><select className="admin-form-select" value={form.discount_type} onChange={(e) => set('discount_type', e.target.value)}><option value="percentage">Percentage (%)</option><option value="fixed">Fixed (৳)</option></select></div>
          </div>
          <div className="admin-form-row">
            <div className="admin-form-group"><label className="admin-form-label">Discount Value *</label><input type="number" className="admin-form-input" value={form.discount_value} onChange={(e) => set('discount_value', e.target.value)} /></div>
            <div className="admin-form-group"><label className="admin-form-label">Max Discount (৳)</label><input type="number" className="admin-form-input" value={form.max_discount} onChange={(e) => set('max_discount', e.target.value)} /></div>
          </div>
          <div className="admin-form-row">
            <div className="admin-form-group"><label className="admin-form-label">Min Order (৳)</label><input type="number" className="admin-form-input" value={form.min_order_amount} onChange={(e) => set('min_order_amount', e.target.value)} /></div>
            <div className="admin-form-group"><label className="admin-form-label">Max Uses</label><input type="number" className="admin-form-input" value={form.usage_limit} onChange={(e) => set('usage_limit', e.target.value)} /></div>
          </div>
          <div className="admin-form-row">
            <div className="admin-form-group"><label className="admin-form-label">Expires At</label><input type="date" className="admin-form-input" value={form.expires_at} onChange={(e) => set('expires_at', e.target.value)} /></div>
            <div className="admin-form-group"><label className="admin-form-label">Active</label><select className="admin-form-select" value={form.is_active} onChange={(e) => set('is_active', e.target.value === 'true')}><option value="true">Yes</option><option value="false">No</option></select></div>
          </div>
          <div className="admin-form-group"><label className="admin-form-label">Description</label><input className="admin-form-input" value={form.description} onChange={(e) => set('description', e.target.value)} /></div>
          <div className="admin-modal-actions"><button type="button" className="admin-btn-cancel" onClick={resetForm}>Cancel</button><button type="submit" className="admin-btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button></div>
        </form>
      </div></div>}

      <div className="admin-table-wrap"><table className="admin-mgmt-table"><thead><tr><th>Code</th><th>Type</th><th>Value</th><th>Min Order</th><th>Uses</th><th>Expires</th><th>Status</th><th>Actions</th></tr></thead><tbody>
        {loading ? <tr><td colSpan={8} className="table-empty">Loading...</td></tr> : coupons.length === 0 ? <tr><td colSpan={8} className="table-empty">No coupons</td></tr> : coupons.map((c) => (
          <tr key={c.id}><td style={{ fontFamily: 'var(--font-heading)', color: '#ddd', letterSpacing: '0.08em' }}>{c.code}</td><td><span className={`badge badge-${c.discount_type}`}>{c.discount_type}</span></td><td>{c.discount_type === 'percentage' ? `${c.discount_value}%` : `৳${c.discount_value}`}{c.max_discount ? ` (max ৳${c.max_discount})` : ''}</td><td>{c.min_order_amount ? `৳${c.min_order_amount}` : '—'}</td><td>{c.usage_count || 0}{c.usage_limit ? `/${c.usage_limit}` : ''}</td><td>{c.expires_at ? new Date(c.expires_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' }) : '∞'}</td><td><span className={`badge ${c.is_active ? 'badge-active' : 'badge-inactive'}`}>{c.is_active ? 'Active' : 'Inactive'}</span></td><td className="admin-actions"><button type="button" className="admin-btn-sm" onClick={() => handleEdit(c)}><HiOutlinePencil size={13} /></button><button type="button" className="admin-btn-sm admin-btn-danger" onClick={() => setDeleteTarget(c)}><HiOutlineTrash size={13} /></button></td></tr>
        ))}</tbody></table></div>

      {deleteTarget && <div className="admin-modal-overlay" onClick={() => setDeleteTarget(null)}><div className="admin-modal confirm-dialog" onClick={(e) => e.stopPropagation()}>
        <h2 className="admin-modal-title">Delete Coupon</h2><p className="confirm-message">Delete coupon <strong>{deleteTarget.code}</strong>?</p>
        <div className="confirm-actions"><button type="button" className="admin-btn-cancel" onClick={() => setDeleteTarget(null)}>Cancel</button><button type="button" className="confirm-btn-danger" onClick={handleDelete}>Delete</button></div>
      </div></div>}
    </div>
  );
}
