import { useState, useEffect } from 'react';
import { HiOutlineTrash, HiOutlineEye, HiOutlineEyeSlash, HiStar } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import api from '../../../services/api';
import '../AdminManagement.css';

export default function ManageReviews() {
  const [reviews, setReviews] = useState([]); const [total, setTotal] = useState(0); const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true); const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchReviews = async () => { setLoading(true); try { const res = await api.get(`/admin/reviews?page=${page}`); setReviews(res.data.data.reviews); setTotal(res.data.data.total); } catch (err) { console.error(err); } finally { setLoading(false); } };
  useEffect(() => { fetchReviews(); }, [page]);

  const toggleVisibility = async (id, current) => {
    try { await api.put(`/admin/reviews/${id}/visibility`, { is_visible: !current }); toast.success(`Review ${!current ? 'shown' : 'hidden'}`, { style: { background: '#070707', color: '#fff', border: '1px solid #222' } }); fetchReviews(); } catch { toast.error('Failed'); }
  };
  const handleDelete = async () => { if (!deleteTarget) return; try { await api.delete(`/admin/reviews/${deleteTarget.id}`); toast.success('Deleted'); setDeleteTarget(null); fetchReviews(); } catch { toast.error('Failed'); } };

  const Stars = ({ n }) => <div style={{ display: 'flex', gap: 1 }}>{[1,2,3,4,5].map(i => <HiStar key={i} size={13} style={{ color: i <= n ? '#F97D01' : '#333' }} />)}</div>;
  const totalPages = Math.ceil(total / 20);

  return (
    <div className="admin-page" id="admin-reviews-view">
      <div className="admin-page-header"><div><h1 className="admin-page-title">Reviews</h1><p className="admin-page-subtitle">{total} customer reviews</p></div></div>
      <div className="admin-table-wrap"><table className="admin-mgmt-table"><thead><tr><th>Customer</th><th>Product</th><th>Rating</th><th>Comment</th><th>Visible</th><th>Date</th><th>Actions</th></tr></thead><tbody>
        {loading ? <tr><td colSpan={7} className="table-empty">Loading...</td></tr> : reviews.length === 0 ? <tr><td colSpan={7} className="table-empty">No reviews</td></tr> : reviews.map((r) => (
          <tr key={r.id}><td style={{ color: '#ddd' }}>{r.user_name}</td><td style={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.product_name}</td><td><Stars n={r.rating} /></td><td style={{ maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#999' }}>{r.comment || '—'}</td><td><span className={`badge ${r.is_visible ? 'badge-active' : 'badge-inactive'}`}>{r.is_visible ? 'Yes' : 'Hidden'}</span></td><td>{new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td><td className="admin-actions"><button type="button" className="admin-btn-sm" onClick={() => toggleVisibility(r.id, r.is_visible)} title={r.is_visible ? 'Hide' : 'Show'}>{r.is_visible ? <HiOutlineEyeSlash size={14} /> : <HiOutlineEye size={14} />}</button><button type="button" className="admin-btn-sm admin-btn-danger" onClick={() => setDeleteTarget(r)}><HiOutlineTrash size={14} /></button></td></tr>
        ))}</tbody></table></div>
      {totalPages > 1 && <div className="admin-pagination"><span className="admin-page-info">Page {page} of {totalPages}</span><div className="admin-page-btns"><button className="admin-page-btn" disabled={page <= 1} onClick={() => setPage(page - 1)}>← Prev</button><button className="admin-page-btn" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next →</button></div></div>}

      {deleteTarget && <div className="admin-modal-overlay" onClick={() => setDeleteTarget(null)}><div className="admin-modal confirm-dialog" onClick={(e) => e.stopPropagation()}>
        <h2 className="admin-modal-title">Delete Review</h2><p className="confirm-message">Delete this review by <strong>{deleteTarget.user_name}</strong>?</p>
        <div className="confirm-actions"><button type="button" className="admin-btn-cancel" onClick={() => setDeleteTarget(null)}>Cancel</button><button type="button" className="confirm-btn-danger" onClick={handleDelete}>Delete</button></div>
      </div></div>}
    </div>
  );
}
