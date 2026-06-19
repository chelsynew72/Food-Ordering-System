import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

const MyOrders = () => {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/orders/my')
      .then(({ data }) => setOrders(data.orders))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page">
      <Navbar />
      <div className="container" style={{ paddingTop: 32, paddingBottom: 48 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 4 }}>My orders</h1>
        <p style={{ color: 'var(--gray)', marginBottom: 28, fontSize: 14 }}>Track all your past and current orders</p>

        {loading ? (
          <div className="spinner" />
        ) : orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📦</div>
            <div className="empty-state-title">No orders yet</div>
            <p style={{ marginBottom: 20 }}>Start by browsing our menu!</p>
            <Link to="/menu" className="btn btn-primary">Browse menu</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {orders.map((order) => (
              <div key={order._id} className="card" style={{ padding: '20px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>Order #{order._id.slice(-8).toUpperCase()}</div>
                    <div style={{ fontSize: 13, color: 'var(--gray)', marginTop: 2 }}>
                      {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <span className={`badge badge-${order.status}`}>{order.status.replace('_', ' ')}</span>
                    <span className={`badge badge-${order.paymentStatus}`}>{order.paymentStatus}</span>
                  </div>
                </div>

                <p style={{ fontSize: 13, color: 'var(--gray)', marginBottom: 14 }}>
                  {order.items.map((i, idx) => `${i.name} ×${i.quantity}${idx < order.items.length - 1 ? ', ' : ''}`)}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, fontSize: 16 }}>LKR {order.totalAmount.toLocaleString()}</span>
                  <Link to={`/order-confirmation/${order._id}`} className="btn btn-outline btn-sm">View details</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
