import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Users, UtensilsCrossed, CreditCard, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NAV = [
  { path: '/admin',           label: 'Dashboard',  Icon: LayoutDashboard  },
  { path: '/admin/orders',    label: 'Orders',      Icon: ShoppingBag      },
  { path: '/admin/customers', label: 'Customers',   Icon: Users            },
  { path: '/admin/foods',     label: 'Menu Items',  Icon: UtensilsCrossed  },
  { path: '/admin/payments',  label: 'Payments',    Icon: CreditCard       },
];

const AdminLayout = ({ children, title, subtitle }) => {
  const { pathname }    = useLocation();
  const { logout }      = useAuth();
  const navigate        = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  const SidebarContent = () => (
    <>
      <div className="admin-sidebar-logo" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>Bolt<span>Eats</span> Admin</span>
        <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', display: 'none' }} className="close-sidebar">
          <X size={18} />
        </button>
      </div>
      <nav>
        {NAV.map(({ path, label, Icon }) => (
          <Link key={path} to={path} className={`admin-nav-item${pathname === path ? ' active' : ''}`} onClick={() => setOpen(false)}>
            <Icon size={16} /> {label}
          </Link>
        ))}
        <button onClick={handleLogout} className="admin-nav-item" style={{ marginTop: 16 }}>
          <LogOut size={16} /> Logout
        </button>
      </nav>
    </>
  );

  return (
    <div className="admin-layout">
      {/* Desktop sidebar */}
      <aside className={`admin-sidebar${open ? ' open' : ''}`}>
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 49 }}
        />
      )}

      <main className="admin-content">
        {/* Mobile top bar */}
        <div style={{
          display: 'none',
          alignItems: 'center',
          gap: 12,
          marginBottom: 20,
          padding: '12px 0',
        }} className="admin-mobile-bar">
          <button
            onClick={() => setOpen(true)}
            style={{ background: 'var(--dark)', color: 'white', border: 'none', borderRadius: 8, padding: '8px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            <Menu size={20} />
          </button>
          <span style={{ fontWeight: 700, fontSize: 16 }}>Bolt<span style={{ color: 'var(--blue)' }}>Eats</span> Admin</span>
        </div>

        {(title || subtitle) && (
          <div className="admin-header">
            {title    && <h1>{title}</h1>}
            {subtitle && <p>{subtitle}</p>}
          </div>
        )}
        {children}
      </main>

      <style>{`
        @media (max-width: 768px) {
          .admin-mobile-bar { display: flex !important; }
          .admin-sidebar { transform: translateX(-100%); }
          .admin-sidebar.open { transform: translateX(0); }
          .close-sidebar { display: flex !important; }
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;
