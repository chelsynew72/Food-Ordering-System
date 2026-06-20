import { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from '../components/AdminLayout';

const AdminPayments = () => {
  const [summary, setSummary] = useState(null);
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get('/api/payment/summary'),
      axios.get('/api/orders/admin/all?limit=50'),
    ])
      .then(([{ data: s }, { data: o }]) => { setSummary(s); setOrders(o.orders); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const CARDS = summary
    ? [
        { label: 'Paid Orders',     value: summary.paid,                              icon: '', bg: '#D4EDDA', color: '#155724' },
        { label: 'Unpaid Orders',   value: summary.unpaid,                            icon: '', bg: '#FFF3CD', color: '#856404' },
        { label: 'Failed Payments', value: summary.failed,                            icon: '', bg: '#F8D7DA', color: '#721C24' },
        { label: 'Total Revenue',   value: `LKR ${summary.totalRevenue.toLocaleString()}`, icon: '', bg: '#E8F5E9', color: '#155724' },
      ]
    : [];

  return (
    <AdminLayout title="Payments" subtitle="Monitor all payment transactions">
      {loading ? (
        <div className="spinner" />
      ) : (
        <>
          <div className="stats-grid" style={{ marginBottom: 28 }}>
            {CARDS.map(({ label, value, icon, bg, color }) => (
              <div key={label} className="stat-card">
                <div style={{ fontSize: 24, background: bg, borderRadius: 10, padding: '8px 10px', display: 'inline-block', marginBottom: 10 }}>{icon}</div>
                <div className="stat-card-label">{label}</div>
                <div className="stat-card-value" style={{ color, fontSize: 22 }}>{value}</div>
              </div>
            ))}
          </div>

          <div className="card" style={{ overflowX: 'auto' }}>
            <div style={{ padding: '16px 24px', borderBottom: '1px solid #F0F0F0' }}>
              <h2 style={{ fontWeight: 700, fontSize: 15 }}>Payment records</h2>
            </div>
            <table className="data-table">
              <thead>
                <tr>{['Order ID', 'Customer', 'Amount', 'Payment', 'Order Status', 'Date'].map((h) => <th key={h}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o._id}>
                    <td style={{ fontWeight: 600 }}>#{o._id.slice(-8).toUpperCase()}</td>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{o.customer?.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--gray)' }}>{o.customer?.phone}</div>
                    </td>
                    <td style={{ fontWeight: 600 }}>LKR {o.totalAmount.toLocaleString()}</td>
                    <td><span className={`badge badge-${o.paymentStatus}`}>{o.paymentStatus}</span></td>
                    <td><span className={`badge badge-${o.status}`}>{o.status.replace('_', ' ')}</span></td>
                    <td style={{ fontSize: 12, color: 'var(--gray)' }}>{new Date(o.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default AdminPayments;
