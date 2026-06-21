import { X, Plus, Minus, Clock, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const FoodModal = ({ food, onClose }) => {
  const { items, addItem, removeItem } = useCart();
  const qty = items.find((i) => i._id === food._id)?.quantity ?? 0;

  const handleAdd = () => { addItem(food); toast.success('Added to cart'); };

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(4px)',
        zIndex: 300,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        animation: 'fadeIn 0.15s ease',
      }}
    >
      <style>{`
        @keyframes fadeIn  { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>

      <div style={{
        background: 'white',
        borderRadius: 20,
        width: '100%',
        maxWidth: 480,
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        animation: 'slideUp 0.2s ease',
      }}>
        {/* Image */}
        <div style={{ position: 'relative' }}>
          <img
            src={food.image || 'https://via.placeholder.com/480x240?text=Food'}
            alt={food.name}
            style={{ width: '100%', height: 240, objectFit: 'cover', display: 'block' }}
          />
          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: 12, right: 12,
              width: 36, height: 36, borderRadius: '50%',
              background: 'rgba(0,0,0,0.5)',
              border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.8)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.5)'; }}
          >
            <X size={18} />
          </button>

          {/* Category badge */}
          <div style={{
            position: 'absolute', top: 12, left: 12,
            background: 'rgba(0,0,0,0.5)',
            color: 'white', fontSize: 12, fontWeight: 600,
            padding: '4px 10px', borderRadius: 50,
          }}>
            {food.category}
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '24px 24px 28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1A1A2E', lineHeight: 1.2, flex: 1 }}>
              {food.name}
            </h2>
            <span style={{ fontSize: 22, fontWeight: 800, color: '#009DE0', marginLeft: 16, whiteSpace: 'nowrap' }}>
              LKR {food.price.toLocaleString()}
            </span>
          </div>

          {/* Meta */}
          <div style={{ display: 'flex', gap: 16, marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: '#72777A' }}>
              <Clock size={14} />
              {food.preparationTime} min
            </div>
            <div style={{
              fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 50,
              background: food.available ? '#D4EDDA' : '#F8D7DA',
              color: food.available ? '#155724' : '#721C24',
            }}>
              {food.available ? '✓ Available' : '✗ Unavailable'}
            </div>
          </div>

          <p style={{ fontSize: 14, color: '#72777A', lineHeight: 1.7, marginBottom: 24 }}>
            {food.description || 'A delicious dish prepared fresh for you.'}
          </p>

          {/* Cart controls */}
          {!food.available ? (
            <div style={{ textAlign: 'center', padding: '14px', background: '#F8D7DA', borderRadius: 12, color: '#721C24', fontSize: 14, fontWeight: 600 }}>
              Currently unavailable
            </div>
          ) : qty === 0 ? (
            <button
              onClick={handleAdd}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', justifyContent: 'center', borderRadius: 14 }}
            >
              <ShoppingBag size={18} />
              Add to cart — LKR {food.price.toLocaleString()}
            </button>
          ) : (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#1A1A2E' }}>In your cart</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#009DE0' }}>
                  LKR {(food.price * qty).toLocaleString()}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button
                  onClick={() => removeItem(food._id)}
                  style={{
                    width: 48, height: 48, borderRadius: 12,
                    border: '1.5px solid #E0E0E0', background: 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#009DE0'; e.currentTarget.style.color = '#009DE0'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#E0E0E0'; e.currentTarget.style.color = 'inherit'; }}
                >
                  <Minus size={18} />
                </button>

                <div style={{
                  flex: 1, height: 48, borderRadius: 12,
                  background: '#F4F4F4',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20, fontWeight: 800, color: '#1A1A2E',
                }}>
                  {qty}
                </div>

                <button
                  onClick={handleAdd}
                  style={{
                    width: 48, height: 48, borderRadius: 12,
                    background: '#009DE0', border: 'none', color: 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#0080B8'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = '#009DE0'; }}
                >
                  <Plus size={18} />
                </button>
              </div>

              <button
                onClick={onClose}
                className="btn btn-ghost"
                style={{ width: '100%', marginTop: 10, justifyContent: 'center', borderRadius: 12 }}
              >
                Continue shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodModal;
