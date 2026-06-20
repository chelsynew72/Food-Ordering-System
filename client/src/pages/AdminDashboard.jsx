import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from '../components/AdminLayout';

const AdminDashboard = () => {
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/admin/stats')
      .then(({ data }) => setStats(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const STAT_CARDS = stats
    ? [
        { label: 'Total Orders',    value: stats.totalOrders,                        icon: '', bg: '#E3F2FD' },
        { label: 'Total Revenue',   value: `LKR ${stats.totalRevenue.toLocaleString()}`, icon: '', bg: '#E8F5E9' },
        { label: 'Customers',       value: stats.totalCustomers,                     icon: '', bg: '#FFF3E0' },
        { label: 'Pending Orders',  value: stats.pendingOrders,                      icon: '', bg: '#FCE4EC' },
      ]
    : [];

  return (
    <AdminLayout title="Dashboard" subtitle="Welcome back! Here's what's happening today.">
      {loading ? (
        <div className="spinner" />
      ) : (
        <>
          {/* Stat cards */}
          <div className="stats-grid">
            {STAT_CARDS.map(({ label, value, icon, bg }) => (
              <div key={label} className="stat-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div className="stat-card-label">{label}</div>
                    <div className="stat-card-value">{value}</div>
                  </div>
                  <div style={{ fontSize: 26, background: bg, borderRadius: 10, padding: '8px 10px' }}>{icon}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent orders */}
          <div className="card">
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #F0F0F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: 16, fontWeight: 700 }}>Recent Orders</h2>
              <Link to="/admin/orders" className="btn btn-outline btn-sm">View all</Link>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    {['Order ID', 'Customer', 'Amount', 'Status', 'Payment', 'Date'].map((h) => <th key={h}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {stats?.recentOrders?.map((o) => (
                    <tr key={o._id}>
                      <td style={{ fontWeight: 600 }}>#{o._id.slice(-8).toUpperCase()}</td>
                      <td>{o.customer?.name ?? 'N/A'}</td>
                      <td style={{ fontWeight: 600 }}>LKR {o.totalAmount.toLocaleString()}</td>
                      <td><span className={`badge badge-${o.status}`}>{o.status.replace('_', ' ')}</span></td>
                      <td><span className={`badge badge-${o.paymentStatus}`}>{o.paymentStatus}</span></td>
                      <td style={{ color: 'var(--gray)', fontSize: 13 }}>{new Date(o.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default AdminDashboard;
