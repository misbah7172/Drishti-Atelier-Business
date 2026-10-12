import { useState, useEffect } from 'react';
import { HiOutlineShieldCheck, HiOutlineShieldExclamation } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import api from '../../../services/api';
import '../AdminManagement.css';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const p = new URLSearchParams({ page }); if (search) p.set('search', search); if (roleFilter) p.set('role', roleFilter);
      const res = await api.get(`/admin/users?${p}`);
      setUsers(res.data.data.users); setTotal(res.data.data.total);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };
  useEffect(() => { fetchUsers(); }, [page, roleFilter]);
  const handleSearch = (e) => { e.preventDefault(); setPage(1); fetchUsers(); };
  const toggleStatus = async (id, current) => {
    try { await api.put(`/admin/users/${id}/status`, { is_active: !current }); toast.success(`User ${!current ? 'enabled' : 'disabled'}`); fetchUsers(); } catch { toast.error('Failed'); }
  };
  const totalPages = Math.ceil(total / 20);

  return (
    <div className="admin-page" id="admin-users-view">
      <div className="admin-page-header"><div><h1 className="admin-page-title">Users</h1><p className="admin-page-subtitle">{total} registered users</p></div></div>
      <div className="admin-toolbar">
        <form onSubmit={handleSearch} style={{ display: 'contents' }}><input type="text" className="admin-search" placeholder="Search name or email..." value={search} onChange={(e) => setSearch(e.target.value)} /></form>
        <select className="admin-filter" value={roleFilter} onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}><option value="">All Roles</option><option value="customer">Customer</option><option value="admin">Admin</option></select>
      </div>
      <div className="admin-table-wrap"><table className="admin-mgmt-table"><thead><tr><th>User</th><th>Email</th><th>Phone</th><th>Role</th><th>Orders</th><th>Status</th><th>Joined</th><th>Actions</th></tr></thead><tbody>
        {loading ? <tr><td colSpan={8} className="table-empty">Loading...</td></tr> : users.length === 0 ? <tr><td colSpan={8} className="table-empty">No users found</td></tr> : users.map((u) => (
          <tr key={u.id}><td style={{ color: '#111827', fontWeight: 600 }}>{u.name}</td><td>{u.email}</td><td>{u.phone || '—'}</td><td><span className={`badge badge-${u.role}`}>{u.role}</span></td><td>{u.order_count}</td><td><span className={`badge ${u.is_active ? 'badge-active' : 'badge-inactive'}`}>{u.is_active ? 'Active' : 'Disabled'}</span></td><td>{new Date(u.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })}</td><td><button type="button" className={`admin-btn-sm ${u.is_active ? 'admin-btn-danger' : ''}`} onClick={() => toggleStatus(u.id, u.is_active)}>{u.is_active ? <><HiOutlineShieldExclamation size={14} /> Disable</> : <><HiOutlineShieldCheck size={14} /> Enable</>}</button></td></tr>
        ))}</tbody></table></div>
      {totalPages > 1 && <div className="admin-pagination"><span className="admin-page-info">Page {page} of {totalPages}</span><div className="admin-page-btns"><button className="admin-page-btn" disabled={page <= 1} onClick={() => setPage(page - 1)}>← Prev</button><button className="admin-page-btn" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next →</button></div></div>}
    </div>
  );
}
