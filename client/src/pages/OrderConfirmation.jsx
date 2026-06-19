import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

const OrderConfirmation = () => {
  const { id } = useParams();
  const [order,   setOrder]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`/api/orders/${id}`)
      .then(({ data }) => setOrder(data.order))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="page">
      <Navbar />
      <div className="order-confirm-page">
        <div className="order-confirm-card">
          {loading ? (
            <div className="spinner" />
          ) : order ? (
            <>
              <div className="order-confirm-icon">{order.paymentStatus === 'paid' ? '✅' : '⏳'}</div>
              <h1 className="order-confirm-title">
                {order.paymentStatus === 'paid' ? 'Order confirmed!' : 'Order received!'}
              </h1>
              <p className="order-confirm-sub">
                {order.paymentStatus === 'paid'
                  ? 'Your payment was successful. Your food is being prepared!'
                  : 'Waiting for payment confirmation from PayHere.'}
              </p>

              {/* Summary */}
              <div style={{ background: '#F8F9FA', borderRadius: 12, padding: '16px 20px', marginBottom: 24, textAlign: 'left' }}>
                {[
                  ['Order ID',  `#${order._id.slice(-8).toUpperCase()}`],
                  ['Status',    <span className={`badge badge-${order.status}`}>{order.status.replace('_', ' ')}</span>],
                  ['Payment',   <span className={`badge badge-${order.paymentStatus}`}>{order.paymentStatus}</span>],
                  ['Total',     <strong>LKR {order.totalAmount.toLocaleString()}</strong>],
                ].map(([label, value]) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <span style={{ color: 'var(--gray)', fontSize: 13 }}>{label}</span>
                    <span style={{ fontSize: 13 }}>{value}</span>
                  </div>
                ))}
              </div>

              {/* Items */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--gray)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>Items</div>
                {order.items.map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, padding: '6px 0', borderBottom: '1px solid #F0F0F0' }}>
                    <span>{item.name} × {item.quantity}</span>
                    <span style={{ fontWeight: 600 }}>LKR {(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <Link to="/my-orders" className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }}>My orders</Link>
                <Link to="/menu"      className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Order again</Link>
              </div>
            </>
          ) : (
            <>
              <div className="order-confirm-icon">❌</div>
              <p>Order not found.</p>
              <Link to="/menu" className="btn btn-primary" style={{ marginTop: 16 }}>Back to menu</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
