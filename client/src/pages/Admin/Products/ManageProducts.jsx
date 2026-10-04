import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import api from '../../../services/api';
import '../AdminManagement.css';

export default function ManageProducts() {
  const [products, setProducts] = useState([]); const [total, setTotal] = useState(0); const [page, setPage] = useState(1);
  const [search, setSearch] = useState(''); const [loading, setLoading] = useState(true); const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    try { const p = new URLSearchParams({ page, limit: 20 }); if (search) p.set('search', search); const res = await api.get(`/admin/products?${p}`); setProducts(res.data.data.products || res.data.data); setTotal(res.data.data.total || 0); } catch (err) { console.error(err); } finally { setLoading(false); }
  };
  useEffect(() => { fetchProducts(); }, [page]);
  const handleSearch = (e) => { e.preventDefault(); setPage(1); fetchProducts(); };
  const handleDelete = async () => {
    if (!deleteTarget) return;
    try { await api.delete(`/admin/products/${deleteTarget.id}`); toast.success('Product deleted', { style: { background: '#070707', color: '#fff', border: '1px solid #222' } }); setDeleteTarget(null); fetchProducts(); } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  return (
    <div className="admin-page" id="admin-products-view">
      <div className="admin-page-header"><div><h1 className="admin-page-title">Products</h1><p className="admin-page-subtitle">{total} products in catalog</p></div><Link to="/admin/products/new" className="admin-btn-primary"><HiOutlinePlus size={16} /> Add Product</Link></div>
      <div className="admin-toolbar"><form onSubmit={handleSearch} style={{ display: 'contents' }}><input type="text" className="admin-search" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} /></form></div>
      <div className="admin-table-wrap"><table className="admin-mgmt-table"><thead><tr><th>Product</th><th>SKU</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th></tr></thead><tbody>
        {loading ? <tr><td colSpan={6} className="table-empty">Loading...</td></tr> : products.length === 0 ? <tr><td colSpan={6} className="table-empty">No products</td></tr> : products.map((p) => (
          <tr key={p.id}>
            <td><div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><img src={p.primary_image || '/images/blue-aviator.png'} alt="" style={{ width: 36, height: 36, borderRadius: 4, objectFit: 'cover', background: '#111' }} /><div><div style={{ color: '#ddd', fontWeight: 500, fontSize: '0.82rem' }}>{p.name}</div><div style={{ color: '#555', fontSize: '0.7rem' }}>{p.brand || ''}</div></div></div></td>
            <td style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#777' }}>{p.sku || '—'}</td>
            <td style={{ fontFamily: 'var(--font-heading)', color: '#ddd' }}>৳{parseFloat(p.price).toLocaleString()}</td>
            <td><span style={{ color: p.stock <= 5 ? '#ef4444' : p.stock <= 15 ? '#f59e0b' : '#22c55e' }}>{p.stock}</span></td>
            <td><span className={`badge badge-${p.status === 'active' ? 'active' : 'inactive'}`}>{p.status}</span></td>
            <td className="admin-actions"><Link to={`/admin/products/${p.id}`} className="admin-btn-sm"><HiOutlinePencil size={13} /> Edit</Link><button type="button" className="admin-btn-sm admin-btn-danger" onClick={() => setDeleteTarget(p)}><HiOutlineTrash size={13} /></button></td>
          </tr>
        ))}</tbody></table></div>

      {deleteTarget && <div className="admin-modal-overlay" onClick={() => setDeleteTarget(null)}><div className="admin-modal confirm-dialog" onClick={(e) => e.stopPropagation()}>
        <h2 className="admin-modal-title">Delete Product</h2><p className="confirm-message">Delete <strong>{deleteTarget.name}</strong>? This cannot be undone.</p>
        <div className="confirm-actions"><button type="button" className="admin-btn-cancel" onClick={() => setDeleteTarget(null)}>Cancel</button><button type="button" className="confirm-btn-danger" onClick={handleDelete}>Delete</button></div>
      </div></div>}
    </div>
  );
}
