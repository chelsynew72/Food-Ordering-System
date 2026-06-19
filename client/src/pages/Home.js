import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = [
  { emoji: '🍕', name: 'Pizza'   },
  { emoji: '🍔', name: 'Burger'  },
  { emoji: '🎂', name: 'Cake'    },
  { emoji: '🍱', name: 'Sushi'   },
  { emoji: '🥗', name: 'Salad'   },
  { emoji: '🍹', name: 'Drinks'  },
  { emoji: '🍮', name: 'Dessert' },
];

const HOW_IT_WORKS = [
  { icon: '📋', title: 'Browse the menu',  desc: 'Explore dishes from top local restaurants.' },
  { icon: '🛒', title: 'Add to cart',      desc: 'Pick your favourites and customise your order.' },
  { icon: '💳', title: 'Pay securely',     desc: 'Checkout safely with PayHere payment gateway.' },
  { icon: '🚴', title: 'Fast delivery',    desc: 'Your food arrives hot and fresh at your door.' },
];

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="page">
      <Navbar />

      {/* Hero */}
      <section className="hero">
        <div className="container">
          <h1 className="hero-title">Delicious food,<br />delivered fast 🚀</h1>
          <p className="hero-sub">Order from the best restaurants near you — fresh, fast, affordable.</p>
          <div style={{ display: 'flex', gap: 12 }}>
            <Link
              to={user ? '/menu' : '/register'}
              className="btn btn-lg"
              style={{ background: 'white', color: 'var(--blue)', fontWeight: 700, borderRadius: 50 }}
            >
              {user ? 'Browse Menu' : 'Get started'}
            </Link>
            {!user && (
              <Link to="/login" className="btn btn-lg" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', borderRadius: 50 }}>
                Sign in
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section style={{ padding: '48px 0' }}>
        <div className="container">
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>Browse by category</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 16 }}>
            {CATEGORIES.map(({ emoji, name }) => (
              <Link
                key={name}
                to={`/menu?category=${name}`}
                style={{ background: 'white', borderRadius: 14, padding: '20px 12px', textAlign: 'center', boxShadow: 'var(--shadow)', transition: 'transform 0.2s, box-shadow 0.2s' }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)';    e.currentTarget.style.boxShadow = 'var(--shadow)';    }}
              >
                <div style={{ fontSize: 36, marginBottom: 8 }}>{emoji}</div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{name}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '0 0 60px' }}>
        <div className="container">
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>How it works</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
            {HOW_IT_WORKS.map(({ icon, title, desc }) => (
              <div key={title} className="card" style={{ padding: '24px 20px' }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{icon}</div>
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{title}</div>
                <div style={{ fontSize: 13, color: 'var(--gray)', lineHeight: 1.5 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
