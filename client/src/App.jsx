import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import Home             from './pages/Home';
import Login            from './pages/Login';
import Register         from './pages/Register';
import Menu             from './pages/Menu';
import MyOrders         from './pages/MyOrders';
import OrderConfirmation from './pages/OrderConfirmation';
import AdminDashboard   from './pages/AdminDashboard';
import AdminOrders      from './pages/AdminOrders';
import AdminCustomers   from './pages/AdminCustomers';
import AdminFoods       from './pages/AdminFoods';
import WakeUpBanner from './components/WakeUpBanner';
import AdminPayments    from './pages/AdminPayments';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="spinner" />
      </div>
    );
  }
  if (!user)                               return <Navigate to="/login"  replace />;
  if (adminOnly && user.role !== 'admin')  return <Navigate to="/menu"   replace />;
  if (!adminOnly && user.role === 'admin') return <Navigate to="/admin"  replace />;
  return children;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/"                         element={<Home />} />
    <Route path="/login"                    element={<Login />} />
    <Route path="/register"                 element={<Register />} />
    <Route path="/menu"                     element={<ProtectedRoute><Menu /></ProtectedRoute>} />
    <Route path="/my-orders"               element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
    <Route path="/order-confirmation/:id"  element={<ProtectedRoute><OrderConfirmation /></ProtectedRoute>} />
    <Route path="/admin"                   element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
    <Route path="/admin/orders"            element={<ProtectedRoute adminOnly><AdminOrders /></ProtectedRoute>} />
    <Route path="/admin/customers"         element={<ProtectedRoute adminOnly><AdminCustomers /></ProtectedRoute>} />
    <Route path="/admin/foods"             element={<ProtectedRoute adminOnly><AdminFoods /></ProtectedRoute>} />
    <Route path="/admin/payments"          element={<ProtectedRoute adminOnly><AdminPayments /></ProtectedRoute>} />
    <Route path="*"                        element={<Navigate to="/" replace />} />
  </Routes>
);

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <CartProvider>
        <WakeUpBanner />
        <Toaster
          position="top-center"
          toastOptions={{ style: { borderRadius: 12, fontFamily: 'Inter, sans-serif', fontWeight: 500 } }}
        />
        <AppRoutes />
      </CartProvider>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
