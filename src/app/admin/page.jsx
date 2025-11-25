'use client';
import AdminDashboard from './AdminDashboard';
import { withAdminAuth } from '../../providers/AuthProvider';

function AdminPage() {
  return <AdminDashboard />;
}

export default withAdminAuth(AdminPage);
