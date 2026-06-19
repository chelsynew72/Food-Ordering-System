import { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from '../components/AdminLayout';

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [total,     setTotal]     = useState(0);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    axios.get('/api/admin/customers')
      .then(({ data }) => { setCustomers(data.customers); setTotal(data.total); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout title="Customers" subtitle={`${total} registered customer${total !== 1 ? 's' : ''}`}>
      {loading ? (
        <div className="spinner" />
      ) : (
        <div className="card" style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                {['Name', 'Email', 'Phone', 'Address', 'Joined'].map((h) => <th key={h}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {customers.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: 32, color: 'var(--gray)' }}>No customers yet</td></tr>
              ) : customers.map((c) => (
                <tr key={c._id}>
                  <td style={{ fontWeight: 600 }}>{c.name}</td>
                  <td>{c.email}</td>
                  <td>{c.phone ?? '—'}</td>
                  <td style={{ color: 'var(--gray)', fontSize: 13 }}>{c.address ?? '—'}</td>
                  <td style={{ color: 'var(--gray)', fontSize: 13 }}>{new Date(c.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminCustomers;
