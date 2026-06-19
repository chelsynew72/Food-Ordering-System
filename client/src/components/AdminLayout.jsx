import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Users, UtensilsCrossed, CreditCard, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NAV = [
  { path: '/admin',           label: 'Dashboard',  Icon: LayoutDashboard  },
  { path: '/admin/orders',    label: 'Orders',      Icon: ShoppingBag      },
  { path: '/admin/customers', label: 'Customers',   Icon: Users            },
  { path: '/admin/foods',     label: 'Menu Items',  Icon: UtensilsCrossed  },
  { path: '/admin/payments',  label: 'Payments',    Icon: CreditCard       },
];

const AdminLayout = ({ children, title, subtitle }) => {
  const { pathname } = useLocation();
  const { logout }   = useAuth();
  const navigate     = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">Bolt<span>Eats</span> Admin</div>
        <nav>
          {NAV.map(({ path, label, Icon }) => (
            <Link key={path} to={path} className={`admin-nav-item${pathname === path ? ' active' : ''}`}>
              <Icon size={17} /> {label}
            </Link>
          ))}
          <button onClick={handleLogout} className="admin-nav-item" style={{ marginTop: 16 }}>
            <LogOut size={17} /> Logout
          </button>
        </nav>
      </aside>

      <main className="admin-content">
        {(title || subtitle) && (
          <div className="admin-header">
            {title    && <h1>{title}</h1>}
            {subtitle && <p>{subtitle}</p>}
          </div>
        )}
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
