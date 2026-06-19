import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const FIELDS = [
  { label: 'Full name',         name: 'name',     type: 'text',     placeholder: 'John Doe',                required: true  },
  { label: 'Email address',     name: 'email',    type: 'email',    placeholder: 'you@example.com',          required: true  },
  { label: 'Password',          name: 'password', type: 'password', placeholder: 'At least 6 characters',    required: true  },
  { label: 'Phone number',      name: 'phone',    type: 'text',     placeholder: '077 123 4567',             required: false },
  { label: 'Delivery address',  name: 'address',  type: 'text',     placeholder: '123 Main Street, Colombo', required: false },
];

const Register = () => {
  const [form, setForm]       = useState({ name: '', email: '', password: '', phone: '', address: '' });
  const [loading, setLoading] = useState(false);
  const { login }  = useAuth();
  const navigate   = useNavigate();

  const handleChange = ({ target: { name, value } }) => setForm((f) => ({ ...f, [name]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post('/api/auth/register', form);
      login(data.token, data.user);
      toast.success('Account created! Welcome 🎉');
      navigate('/menu');
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">BoltEats</div>
        <h1 className="auth-title">Create account</h1>
        <p className="auth-subtitle">Sign up to start ordering great food</p>

        <form onSubmit={handleSubmit}>
          {FIELDS.map(({ label, name, type, placeholder, required }) => (
            <div className="form-group" key={name}>
              <label className="form-label">{label}</label>
              <input name={name} type={type} placeholder={placeholder} value={form[name]} onChange={handleChange} required={required} />
            </div>
          ))}
          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 8 }} disabled={loading}>
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--gray)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--blue)', fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
