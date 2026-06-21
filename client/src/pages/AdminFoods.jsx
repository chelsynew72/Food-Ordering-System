import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';

const CATEGORIES = ['Pizza', 'Burger', 'Cake', 'Sushi', 'Salad', 'Drinks', 'Dessert', 'Other'];
const EMPTY      = { name: '', description: '', price: '', category: 'Pizza', image: '', preparationTime: 20, available: true };

const MODAL_FIELDS = [
  { label: 'Name',                   name: 'name',            type: 'text',   required: true  },
  { label: 'Description',            name: 'description',     type: 'text',   required: false },
  { label: 'Price (LKR)',            name: 'price',           type: 'number', required: true  },
  { label: 'Image URL',              name: 'image',           type: 'url',    required: false },
  { label: 'Preparation time (min)', name: 'preparationTime', type: 'number', required: false },
];

const AdminFoods = () => {
  const [foods,     setFoods]     = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId,    setEditId]    = useState(null);
  const [form,      setForm]      = useState(EMPTY);
  const [saving,    setSaving]    = useState(false);

  useEffect(() => {
    axios.get('/api/foods')
      .then(({ data }) => setFoods(data.foods))
      .finally(() => setLoading(false));
  }, []);

  const openCreate = () => { setForm(EMPTY); setEditId(null); setShowModal(true); };
  const openEdit   = (food) => {
    setForm({
      name: food.name, description: food.description ?? '',
      price: food.price, category: food.category,
      image: food.image ?? '', preparationTime: food.preparationTime,
      available: food.available,
    });
    setEditId(food._id);
    setShowModal(true);
  };

  const handleChange = ({ target: { name, value, type, checked } }) =>
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form, price: parseFloat(form.price), preparationTime: parseInt(form.preparationTime) };
    try {
      if (editId) {
        const { data } = await axios.put(`/api/foods/${editId}`, payload);
        setFoods((prev) => prev.map((f) => (f._id === editId ? data.food : f)));
        toast.success('Item updated');
      } else {
        const { data } = await axios.post('/api/foods', payload);
        setFoods((prev) => [data.food, ...prev]);
        toast.success('Item added');
      }
      setShowModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    try {
      await axios.delete(`/api/foods/${id}`);
      setFoods((prev) => prev.filter((f) => f._id !== id));
      toast.success('Item deleted');
    } catch {
      toast.error('Delete failed');
    }
  };

  return (
    <AdminLayout title="Menu Items" subtitle="Add, edit, or remove food items">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
        <button className="btn btn-primary" onClick={openCreate}>
          <Plus size={15} /> Add item
        </button>
      </div>

      {loading ? (
        <div className="spinner" />
      ) : (
        <div className="card">
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  {['Image', 'Name', 'Category', 'Price', 'Prep Time', 'Available', 'Actions'].map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {foods.map((food) => (
                  <tr key={food._id}>
                    <td>
                      <img
                        src={food.image || 'https://via.placeholder.com/60x44?text=Food'}
                        alt={food.name}
                        style={{ width: 56, height: 40, objectFit: 'cover', borderRadius: 8, display: 'block' }}
                      />
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{food.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--gray)' }}>{food.description?.slice(0, 40)}</div>
                    </td>
                    <td>{food.category}</td>
                    <td style={{ fontWeight: 600 }}>LKR {food.price.toLocaleString()}</td>
                    <td>{food.preparationTime} min</td>
                    <td style={{ color: food.available ? 'var(--success)' : 'var(--danger)', fontWeight: 600, fontSize: 13 }}>
                      {food.available ? '✓ Yes' : '✗ No'}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => openEdit(food)}><Pencil size={13} /></button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(food._id)}><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
        >
          <div className="card" style={{ width: '100%', maxWidth: 500, maxHeight: '90vh', overflowY: 'auto', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <h2 style={{ fontSize: 17, fontWeight: 700 }}>{editId ? 'Edit item' : 'Add new item'}</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray)' }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSave}>
              {MODAL_FIELDS.map(({ label, name, type, required }) => (
                <div className="form-group" key={name}>
                  <label className="form-label">{label}</label>
                  <input name={name} type={type} value={form[name]} onChange={handleChange} required={required} />
                </div>
              ))}
              <div className="form-group">
                <label className="form-label">Category</label>
                <select name="category" value={form.category} onChange={handleChange}>
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <input type="checkbox" id="available" name="available" checked={form.available} onChange={handleChange} style={{ width: 'auto' }} />
                <label htmlFor="available" style={{ fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>Available for order</label>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button type="button" className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={saving}>
                  {saving ? 'Saving…' : 'Save item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminFoods;
