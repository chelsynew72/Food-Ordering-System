import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">Bolt<span>Eats</span></Link>

        <div className="navbar-actions">
          {user ? (
            <>
              {!isAdmin && (
                <Link to="/menu" className="btn btn-ghost btn-sm" style={{ position: 'relative' }}>
                  <ShoppingCart size={15} />
                  <span>Order</span>
                  {itemCount > 0 && (
                    <span style={{
                      background: 'var(--blue)', color: 'white',
                      borderRadius: '50%', width: 17, height: 17,
                      fontSize: 10, fontWeight: 700,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      {itemCount}
                    </span>
                  )}
                </Link>
              )}
              {!isAdmin && (
                <Link to="/my-orders" className="btn btn-ghost btn-sm">
                  <User size={15} />
                  <span>My Orders</span>
                </Link>
              )}
              {isAdmin && (
                <Link to="/admin" className="btn btn-ghost btn-sm">
                  <LayoutDashboard size={15} />
                  <span>Dashboard</span>
                </Link>
              )}
              <button onClick={handleLogout} className="btn btn-outline btn-sm">
                <LogOut size={14} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login"    className="btn btn-ghost btn-sm">Sign in</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
