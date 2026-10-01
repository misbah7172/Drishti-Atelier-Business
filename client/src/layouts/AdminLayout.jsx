import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar/AdminSidebar';
import './AdminLayout.css';

export default function AdminLayout() {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
