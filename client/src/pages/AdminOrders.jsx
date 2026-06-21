import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import AdminLayout from '../components/AdminLayout';

const STATUS_OPTIONS = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];

const AdminOrders = () => {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState('');

  const fetchOrders = () => {
    setLoading(true);
    const query = filter ? `?status=${filter}` : '';
    axios.get(`/api/orders/admin/all${query}`)
      .then(({ data }) => setOrders(data.orders))
      .catch(() => toast.error('Failed to load orders'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, [filter]);

  const updateStatus = async (orderId, status) => {
    try {
      await axios.put(`/api/orders/${orderId}/status`, { status });
      setOrders((prev) => prev.map((o) => (o._id === orderId ? { ...o, status } : o)));
      toast.success('Status updated');
    } catch {
      toast.error('Update failed');
    }
  };

  return (
    <AdminLayout title="Orders" subtitle="Manage and update customer orders">
      <div style={{ marginBottom: 20 }}>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ width: 'auto', minWidth: 160 }}>
          <option value="">All statuses</option>
          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="spinner" />
      ) : (
        <div className="card">
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  {['Order ID', 'Customer', 'Items', 'Total', 'Payment', 'Status', 'Date', 'Update'].map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: 32, color: 'var(--gray)' }}>
                      No orders found
                    </td>
                  </tr>
                ) : orders.map((o) => (
                  <tr key={o._id}>
                    <td style={{ fontWeight: 600 }}>#{o._id.slice(-8).toUpperCase()}</td>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{o.customer?.name}</div>
                      <div style={{ color: 'var(--gray)', fontSize: 12 }}>{o.customer?.email}</div>
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--gray)', maxWidth: 160 }}>
                      {o.items.map((i) => `${i.name} ×${i.quantity}`).join(', ')}
                    </td>
                    <td style={{ fontWeight: 600 }}>LKR {o.totalAmount.toLocaleString()}</td>
                    <td><span className={`badge badge-${o.paymentStatus}`}>{o.paymentStatus}</span></td>
                    <td><span className={`badge badge-${o.status}`}>{o.status.replace('_', ' ')}</span></td>
                    <td style={{ fontSize: 12, color: 'var(--gray)' }}>
                      {new Date(o.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <select
                        value={o.status}
                        onChange={(e) => updateStatus(o._id, e.target.value)}
                        style={{ fontSize: 12, padding: '6px 10px', minWidth: 130 }}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>{s.replace('_', ' ')}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminOrders;
