import { useState, useEffect } from 'react';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiXMark } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import api from '../../../services/api';
import '../AdminManagement.css';

export default function ManageCategories() {
  const [categories, setCategories] = useState([]); const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false); const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', slug: '', description: '', parent_id: '' });
  const [saving, setSaving] = useState(false); const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchCategories = async () => { try { const res = await api.get('/admin/categories'); setCategories(res.data.data); } catch (err) { console.error(err); } finally { setLoading(false); } };
  useEffect(() => { fetchCategories(); }, []);

  const resetForm = () => { setForm({ name: '', slug: '', description: '', parent_id: '' }); setEditingId(null); setShowForm(false); };
  const handleEdit = (c) => { setForm({ name: c.name, slug: c.slug, description: c.description || '', parent_id: c.parent_id || '' }); setEditingId(c.id); setShowForm(true); };

  const handleSubmit = async (e) => {
    e.preventDefault(); if (!form.name) return toast.error('Name required');
    setSaving(true);
    try {
      const body = { ...form, slug: form.slug || form.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''), parent_id: form.parent_id || null };
      if (editingId) { await api.put(`/admin/categories/${editingId}`, body); toast.success('Updated'); }
      else { await api.post('/admin/categories', body); toast.success('Created'); }
      resetForm(); fetchCategories();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try { await api.delete(`/admin/categories/${deleteTarget.id}`); toast.success('Deleted'); setDeleteTarget(null); fetchCategories(); }
    catch (err) { toast.error(err.response?.data?.message || 'Cannot delete — has products'); }
  };

  const parents = categories.filter(c => !c.parent_id);

  return (
    <div className="admin-page" id="admin-categories-view">
      <div className="admin-page-header"><div><h1 className="admin-page-title">Categories</h1><p className="admin-page-subtitle">{categories.length} categories</p></div>
        {!showForm && <button type="button" className="admin-btn-primary" onClick={() => setShowForm(true)}><HiOutlinePlus size={16} /> Add Category</button>}
      </div>

      {showForm && <div className="admin-modal-overlay" onClick={resetForm}><div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="admin-modal-close" onClick={resetForm}><HiXMark size={20} /></button>
        <h2 className="admin-modal-title">{editingId ? 'Edit Category' : 'New Category'}</h2>
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="admin-form-group"><label className="admin-form-label">Name *</label><input className="admin-form-input" value={form.name} onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))} /></div>
          <div className="admin-form-group"><label className="admin-form-label">Slug</label><input className="admin-form-input" value={form.slug} onChange={(e) => setForm(p => ({ ...p, slug: e.target.value }))} placeholder="Auto-generated" /></div>
          <div className="admin-form-group"><label className="admin-form-label">Parent Category</label><select className="admin-form-select" value={form.parent_id} onChange={(e) => setForm(p => ({ ...p, parent_id: e.target.value }))}><option value="">None (Top Level)</option>{parents.filter(c => c.id !== editingId).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
          <div className="admin-form-group"><label className="admin-form-label">Description</label><input className="admin-form-input" value={form.description} onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))} /></div>
          <div className="admin-modal-actions"><button type="button" className="admin-btn-cancel" onClick={resetForm}>Cancel</button><button type="submit" className="admin-btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button></div>
        </form>
      </div></div>}

      <div className="admin-table-wrap"><table className="admin-mgmt-table"><thead><tr><th>Category</th><th>Slug</th><th>Parent</th><th>Products</th><th>Actions</th></tr></thead><tbody>
        {loading ? <tr><td colSpan={5} className="table-empty">Loading...</td></tr> : categories.length === 0 ? <tr><td colSpan={5} className="table-empty">No categories</td></tr> : categories.map((c) => (
          <tr key={c.id}><td style={{ color: '#111827', fontWeight: c.parent_id ? 500 : 600, paddingLeft: c.parent_id ? '2rem' : '1rem' }}>{c.parent_id ? '↳ ' : ''}{c.name}</td><td style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#6B7280' }}>{c.slug}</td><td>{c.parent_id ? parents.find(p => p.id === c.parent_id)?.name || '—' : '—'}</td><td>{c.product_count || 0}</td><td className="admin-actions"><button type="button" className="admin-btn-sm" onClick={() => handleEdit(c)}><HiOutlinePencil size={13} /> Edit</button><button type="button" className="admin-btn-sm admin-btn-danger" onClick={() => setDeleteTarget(c)}><HiOutlineTrash size={13} /></button></td></tr>
        ))}</tbody></table></div>

      {deleteTarget && <div className="admin-modal-overlay" onClick={() => setDeleteTarget(null)}><div className="admin-modal confirm-dialog" onClick={(e) => e.stopPropagation()}>
        <h2 className="admin-modal-title">Delete Category</h2><p className="confirm-message">Delete <strong>{deleteTarget.name}</strong>? Categories with products cannot be deleted.</p>
        <div className="confirm-actions"><button type="button" className="admin-btn-cancel" onClick={() => setDeleteTarget(null)}>Cancel</button><button type="button" className="confirm-btn-danger" onClick={handleDelete}>Delete</button></div>
      </div></div>}
    </div>
  );
}
