import { useState, useEffect } from 'react';
import { HiXMark } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import api from '../../../services/api';
import '../AdminManagement.css';

const ORDER_STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
const PAYMENT_STATUSES = ['pending', 'paid', 'refunded'];

export default function ManageOrders() {
  const [orders, setOrders] = useState([]); const [total, setTotal] = useState(0); const [page, setPage] = useState(1);
  const [search, setSearch] = useState(''); const [statusFilter, setStatusFilter] = useState(''); const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); const [newStatus, setNewStatus] = useState(''); const [newPayment, setNewPayment] = useState(''); const [note, setNote] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    try { const p = new URLSearchParams({ page }); if (search) p.set('search', search); if (statusFilter) p.set('order_status', statusFilter); const res = await api.get(`/admin/orders?${p}`); setOrders(res.data.data.orders); setTotal(res.data.data.total); } catch (err) { console.error(err); } finally { setLoading(false); }
  };
  useEffect(() => { fetchOrders(); }, [page, statusFilter]);
  const handleSearch = (e) => { e.preventDefault(); setPage(1); fetchOrders(); };
  const openEdit = (o) => { setEditing(o); setNewStatus(o.order_status); setNewPayment(o.payment_status); setNote(''); };
  const handleUpdate = async () => {
    try {
      const body = {}; if (newStatus !== editing.order_status) body.order_status = newStatus; if (newPayment !== editing.payment_status) body.payment_status = newPayment; if (note) body.note = note;
      if (!body.order_status && !body.payment_status) { setEditing(null); return; }
      await api.put(`/admin/orders/${editing.id}/status`, body);
      toast.success('Order updated', { style: { background: '#070707', color: '#fff', border: '1px solid #222' } }); setEditing(null); fetchOrders();
    } catch { toast.error('Failed'); }
  };
  const totalPages = Math.ceil(total / 20);

  return (
    <div className="admin-page" id="admin-orders-view">
      <div className="admin-page-header"><div><h1 className="admin-page-title">Orders</h1><p className="admin-page-subtitle">{total} total orders</p></div></div>
      <div className="admin-toolbar">
        <form onSubmit={handleSearch} style={{ display: 'contents' }}><input type="text" className="admin-search" placeholder="Search order # or customer..." value={search} onChange={(e) => setSearch(e.target.value)} /></form>
        <select className="admin-filter" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}><option value="">All Statuses</option>{ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}</select>
      </div>
      <div className="admin-table-wrap"><table className="admin-mgmt-table"><thead><tr><th>Order #</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th>Payment</th><th>Date</th><th>Actions</th></tr></thead><tbody>
        {loading ? <tr><td colSpan={8} className="table-empty">Loading...</td></tr> : orders.length === 0 ? <tr><td colSpan={8} className="table-empty">No orders</td></tr> : orders.map((o) => (
          <tr key={o.id}><td style={{ color: '#ddd' }}>{o.order_number}</td><td>{o.customer_name}</td><td>{o.items_count}</td><td style={{ fontFamily: 'var(--font-heading)', color: '#ddd' }}>৳{parseFloat(o.total).toLocaleString()}</td><td><span className={`badge badge-${o.order_status}`}>{o.order_status}</span></td><td><span className={`badge badge-${o.payment_status}`}>{o.payment_status}</span></td><td>{new Date(o.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td><td><button type="button" className="admin-btn-sm" onClick={() => openEdit(o)}>Update</button></td></tr>
        ))}</tbody></table></div>
      {totalPages > 1 && <div className="admin-pagination"><span className="admin-page-info">Page {page} of {totalPages}</span><div className="admin-page-btns"><button className="admin-page-btn" disabled={page <= 1} onClick={() => setPage(page - 1)}>← Prev</button><button className="admin-page-btn" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next →</button></div></div>}

      {editing && <div className="admin-modal-overlay" onClick={() => setEditing(null)}><div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="admin-modal-close" onClick={() => setEditing(null)}><HiXMark size={20} /></button>
        <h2 className="admin-modal-title">Update Order {editing.order_number}</h2>
        <div className="admin-form">
          <div className="admin-form-row"><div className="admin-form-group"><label className="admin-form-label">Order Status</label><select className="admin-form-select" value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>{ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}</select></div><div className="admin-form-group"><label className="admin-form-label">Payment</label><select className="admin-form-select" value={newPayment} onChange={(e) => setNewPayment(e.target.value)}>{PAYMENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}</select></div></div>
          <div className="admin-form-group"><label className="admin-form-label">Note</label><input type="text" className="admin-form-input" value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Shipped via Pathao" /></div>
          <div className="admin-modal-actions"><button type="button" className="admin-btn-cancel" onClick={() => setEditing(null)}>Cancel</button><button type="button" className="admin-btn-primary" onClick={handleUpdate}>Save</button></div>
        </div>
      </div></div>}
    </div>
  );
}
