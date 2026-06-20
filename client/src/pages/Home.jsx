import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = [
  { emoji: '🍕', name: 'Pizza',   color: '#FFF3E0', border: '#FFB74D' },
  { emoji: '🍔', name: 'Burger',  color: '#FBE9E7', border: '#FF7043' },
  { emoji: '🎂', name: 'Cake',    color: '#FCE4EC', border: '#F06292' },
  { emoji: '🍱', name: 'Sushi',   color: '#E8F5E9', border: '#66BB6A' },
  { emoji: '🥗', name: 'Salad',   color: '#E3F2FD', border: '#42A5F5' },
  { emoji: '🍹', name: 'Drinks',  color: '#EDE7F6', border: '#7E57C2' },
  { emoji: '🍮', name: 'Dessert', color: '#E0F7FA', border: '#26C6DA' },
];

const STEPS = [
  { num: '01', icon: '🗺️', title: 'Browse the menu',   desc: 'Explore dishes from local restaurants — filtered by mood, cuisine, or craving.' },
  { num: '02', icon: '🛒', title: 'Add to cart',        desc: 'Pick your favourites, adjust quantities, and build the perfect order.' },
  { num: '03', icon: '💳', title: 'Pay securely',       desc: 'Check out in seconds with PayHere — your card details are never stored.' },
  { num: '04', icon: '🚴', title: 'Fresh to your door', desc: 'Track your order live and receive hot, fresh food right where you are.' },
];

const STATS = [
  { value: '25+',  label: 'Menu items'   },
  { value: '7',    label: 'Cuisines'     },
  { value: '20m',  label: 'Avg delivery' },
  { value: '100%', label: 'Fresh daily'  },
];

const Home = () => {
  const { user } = useAuth();

  return (
    <div style={{ background: '#F7F7F7', minHeight: '100vh' }}>
      <Navbar />

      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, #009DE0 0%, #0072B8 55%, #005490 100%)',
        padding: '72px 24px 80px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 320, height: 320, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -80, left: '30%', width: 240, height: 240, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)',
            borderRadius: 50, padding: '6px 16px', marginBottom: 24,
          }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ADE80', display: 'inline-block' }} />
            <span style={{ color: 'white', fontSize: 13, fontWeight: 600, letterSpacing: '0.3px' }}>Now delivering near you</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(36px, 6vw, 64px)',
            fontWeight: 800,
            color: 'white',
            lineHeight: 1.08,
            marginBottom: 20,
            letterSpacing: '-1.5px',
          }}>
            Great food,<br />
            <span style={{ color: '#A8DFFF' }}>at your door</span><br />
            in minutes.
          </h1>

          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.82)', marginBottom: 36, maxWidth: 480, lineHeight: 1.6 }}>
            Order from local restaurants and get hot, fresh meals delivered fast — no hassle, no waiting.
          </p>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link
              to={user ? '/menu' : '/register'}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'white', color: '#009DE0',
                fontWeight: 700, fontSize: 16,
                padding: '14px 28px', borderRadius: 50,
                transition: 'transform 0.2s, box-shadow 0.2s',
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.2)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)'; }}
            >
              {user ? ' Browse Menu' : " Get started — it's free"}
            </Link>
            {!user && (
              <Link
                to="/login"
                style={{
                  display: 'inline-flex', alignItems: 'center',
                  background: 'rgba(255,255,255,0.12)',
                  color: 'white', fontWeight: 600, fontSize: 16,
                  padding: '14px 28px', borderRadius: 50,
                  border: '1.5px solid rgba(255,255,255,0.3)',
                  textDecoration: 'none',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.2)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; }}
              >
                Sign in
              </Link>
            )}
          </div>

          <div style={{ display: 'flex', gap: 32, marginTop: 52, flexWrap: 'wrap' }}>
            {STATS.map(({ value, label }) => (
              <div key={label}>
                <div style={{ fontSize: 26, fontWeight: 800, color: 'white', lineHeight: 1 }}>{value}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', marginTop: 4 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section style={{ padding: '60px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28 }}>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#009DE0', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 6 }}>What are you craving?</p>
              <h2 style={{ fontSize: 26, fontWeight: 800, color: '#1A1A2E', letterSpacing: '-0.5px' }}>Browse by category</h2>
            </div>
            <Link to="/menu" style={{ fontSize: 14, fontWeight: 600, color: '#009DE0', textDecoration: 'none' }}>See all →</Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 14 }}>
            {CATEGORIES.map(({ emoji, name, color, border }) => (
              <Link
                key={name}
                to={`/menu?category=${name}`}
                style={{
                  background: color,
                  border: `1.5px solid ${border}30`,
                  borderRadius: 16,
                  padding: '22px 12px 18px',
                  textAlign: 'center',
                  textDecoration: 'none',
                  transition: 'transform 0.18s, box-shadow 0.18s',
                  display: 'block',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 12px 28px ${border}30`; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{ fontSize: 38, marginBottom: 10, lineHeight: 1 }}>{emoji}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#1A1A2E' }}>{name}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Promo banner */}
      <section style={{ padding: '0 24px 60px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{
            background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)',
            borderRadius: 24,
            padding: '40px 48px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 24,
          }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#009DE0', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 10 }}>Limited time</div>
              <h3 style={{ fontSize: 28, fontWeight: 800, color: 'white', marginBottom: 10, letterSpacing: '-0.5px' }}>
                Free delivery on<br />your first order 🎉
              </h3>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>
                Sign up today and enjoy free delivery — no minimum order required.
              </p>
            </div>
            <Link
              to="/register"
              style={{
                background: '#009DE0', color: 'white',
                fontWeight: 700, fontSize: 15,
                padding: '14px 28px', borderRadius: 50,
                textDecoration: 'none', whiteSpace: 'nowrap',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#0080B8'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#009DE0'; }}
            >
              Claim offer →
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '0 24px 80px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ marginBottom: 40 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#009DE0', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 6 }}>Simple as that</p>
            <h2 style={{ fontSize: 26, fontWeight: 800, color: '#1A1A2E', letterSpacing: '-0.5px' }}>How it works</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
            {STEPS.map(({ num, icon, title, desc }, i) => (
              <div
                key={num}
                style={{
                  background: 'white',
                  borderRadius: 18,
                  padding: '28px 24px',
                  boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.1)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 16px rgba(0,0,0,0.06)'; }}
              >
                <div style={{
                  position: 'absolute', top: 16, right: 20,
                  fontSize: 48, fontWeight: 800, color: '#F0F0F0',
                  lineHeight: 1, userSelect: 'none', pointerEvents: 'none',
                }}>
                  {num}
                </div>
                <div style={{
                  width: 52, height: 52, borderRadius: 14,
                  background: i === 0 ? '#E6F6FD' : i === 1 ? '#FFF3E0' : i === 2 ? '#E8F5E9' : '#FCE4EC',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 24, marginBottom: 18,
                }}>
                  {icon}
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#1A1A2E', marginBottom: 8 }}>{title}</div>
                <div style={{ fontSize: 14, color: '#72777A', lineHeight: 1.6 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section style={{ padding: '0 24px 60px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: '#1A1A2E', marginBottom: 12, letterSpacing: '-0.5px' }}>
            Ready to order?
          </h2>
          <p style={{ color: '#72777A', fontSize: 16, marginBottom: 28 }}>
            Join thousands of happy customers getting great food delivered daily.
          </p>
          <Link
            to={user ? '/menu' : '/register'}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: '#009DE0', color: 'white',
              fontWeight: 700, fontSize: 16,
              padding: '16px 36px', borderRadius: 50,
              textDecoration: 'none',
              boxShadow: '0 4px 20px rgba(0,157,224,0.35)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,157,224,0.45)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,157,224,0.35)'; }}
          >
            {user ? 'Browse Menu →' : 'Start ordering →'}
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #EBEBEB', background: 'white', padding: '24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#009DE0' }}>
            Bolt<span style={{ color: '#1A1A2E' }}>Eats</span>
          </div>
          <div style={{ fontSize: 13, color: '#ABABAB' }}>
            © {new Date().getFullYear()} BoltEats. Built with ❤️ for fast food lovers.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
