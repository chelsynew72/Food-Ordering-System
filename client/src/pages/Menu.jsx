import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Plus, Minus, ShoppingBag } from 'lucide-react';
import Navbar from '../components/Navbar';
import FoodModal from '../components/FoodModal';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = ['All', 'Pizza', 'Burger', 'Cake', 'Sushi', 'Salad', 'Drinks', 'Dessert', 'Other'];

const Menu = () => {
  const [foods,      setFoods]      = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [category,   setCategory]   = useState('All');
  const [address,    setAddress]    = useState('');
  const [ordering,   setOrdering]   = useState(false);
  const [selected,   setSelected]   = useState(null); // food for modal

  const { items, addItem, removeItem, clearCart, total, itemCount } = useCart();
  const { user }  = useAuth();
  const [params]  = useSearchParams();

  useEffect(() => { const c = params.get('category'); if (c) setCategory(c); }, [params]);
  useEffect(() => { if (user?.address) setAddress(user.address); }, [user]);

  useEffect(() => {
    setLoading(true);
    const query = category !== 'All' ? `?category=${category}` : '';
    axios.get(`/api/foods${query}`)
      .then(({ data }) => setFoods(data.foods))
      .catch(() => toast.error('Failed to load menu'))
      .finally(() => setLoading(false));
  }, [category]);

  const getQty = (id) => items.find((i) => i._id === id)?.quantity ?? 0;

  const placeOrder = async () => {
    if (!address.trim()) { toast.error('Enter a delivery address'); return; }
    if (!items.length)   { toast.error('Your cart is empty');       return; }
    setOrdering(true);
    try {
      const { data: orderData } = await axios.post('/api/orders', {
        items: items.map(({ _id, quantity }) => ({ foodId: _id, quantity })),
        deliveryAddress: address,
      });

      const { data: payData } = await axios.post('/api/payment/initiate', { orderId: orderData.order._id });
      const p = payData.payhereParams;

      clearCart();

      const form = document.createElement('form');
      form.method = 'POST';
      form.action = 'https://sandbox.payhere.lk/pay/checkout';
      Object.entries(p).forEach(([key, val]) => {
        const input = document.createElement('input');
        input.type  = 'hidden';
        input.name  = key;
        input.value = String(val);
        form.appendChild(input);
      });
      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Order failed');
      setOrdering(false);
    }
  };

  return (
    <div className="page">
      <Navbar />

      {/* Food detail modal */}
      {selected && <FoodModal food={selected} onClose={() => setSelected(null)} />}

      <div className="container" style={{ paddingTop: 32, paddingBottom: 48 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 4 }}>Menu</h1>
        <p style={{ color: 'var(--gray)', marginBottom: 24, fontSize: 14 }}>Fresh food, ready to order</p>

        <div className="category-pills" style={{ marginBottom: 28 }}>
          {CATEGORIES.map((cat) => (
            <button key={cat} className={`category-pill${category === cat ? ' active' : ''}`} onClick={() => setCategory(cat)}>
              {cat}
            </button>
          ))}
        </div>

        <div className="menu-layout">
          <div>
            {loading ? (
              <div className="spinner" />
            ) : foods.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">🍽️</div>
                <div className="empty-state-title">No items in this category</div>
              </div>
            ) : (
              <div className="food-grid">
                {foods.map((food) => {
                  const qty = getQty(food._id);
                  return (
                    <div
                      key={food._id}
                      className="food-card"
                      onClick={() => setSelected(food)}
                    >
                      <img
                        src={food.image || 'https://via.placeholder.com/400x160?text=Food'}
                        alt={food.name}
                        className="food-card-img"
                      />
                      <div className="food-card-body">
                        <div className="food-card-name">{food.name}</div>
                        <div className="food-card-desc">{food.description}</div>
                        <div style={{ fontSize: 12, color: 'var(--gray)', marginBottom: 10 }}>
                          🕐 {food.preparationTime} min
                        </div>
                        <div className="food-card-footer">
                          <span className="food-card-price">LKR {food.price.toLocaleString()}</span>
                          {qty === 0 ? (
                            <button
                              className="food-card-add"
                              onClick={(e) => { e.stopPropagation(); addItem(food); toast.success('Added to cart'); }}
                            >
                              +
                            </button>
                          ) : (
                            <div
                              style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button className="cart-qty-btn" onClick={() => removeItem(food._id)}><Minus size={12} /></button>
                              <span style={{ fontWeight: 700, fontSize: 15, minWidth: 16, textAlign: 'center' }}>{qty}</span>
                              <button className="cart-qty-btn" onClick={() => addItem(food)} style={{ borderColor: 'var(--blue)', color: 'var(--blue)' }}><Plus size={12} /></button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Cart sidebar */}
          <div className="cart-sidebar">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <ShoppingBag size={20} color="var(--blue)" />
              <span className="cart-title" style={{ margin: 0 }}>Your cart</span>
              {itemCount > 0 && (
                <span style={{ background: 'var(--blue)', color: 'white', borderRadius: 50, padding: '2px 8px', fontSize: 12, fontWeight: 700 }}>
                  {itemCount}
                </span>
              )}
            </div>

            {items.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '28px 0', color: 'var(--gray)' }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>🛒</div>
                <div style={{ fontSize: 14 }}>Your cart is empty</div>
              </div>
            ) : (
              <>
                {items.map((item) => (
                  <div key={item._id} className="cart-item">
                    <div>
                      <div className="cart-item-name">{item.name}</div>
                      <div className="cart-item-price">LKR {(item.price * item.quantity).toLocaleString()}</div>
                    </div>
                    <div className="cart-qty-controls">
                      <button className="cart-qty-btn" onClick={() => removeItem(item._id)}><Minus size={11} /></button>
                      <span style={{ fontWeight: 700, fontSize: 14 }}>{item.quantity}</span>
                      <button className="cart-qty-btn" onClick={() => addItem(item)} style={{ borderColor: 'var(--blue)' }}><Plus size={11} /></button>
                    </div>
                  </div>
                ))}

                <div className="cart-total">
                  <span>Total</span>
                  <span>LKR {total.toLocaleString()}</span>
                </div>

                <div style={{ marginTop: 16 }}>
                  <label className="form-label">Delivery address</label>
                  <input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter your delivery address"
                    style={{ marginBottom: 12 }}
                  />
                  <button
                    className="btn btn-primary"
                    style={{ width: '100%' }}
                    onClick={placeOrder}
                    disabled={ordering}
                  >
                    {ordering ? 'Processing…' : `Pay LKR ${total.toLocaleString()}`}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
