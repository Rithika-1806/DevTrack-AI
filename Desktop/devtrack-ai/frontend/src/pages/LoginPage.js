import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      await login(formData);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#eeeee6',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>

      {/* Card */}
      <div style={{
        background: '#fff',
        borderRadius: '20px',
        padding: '44px 40px',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)'
      }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '48px', height: '48px',
            background: '#2e7d52',
            borderRadius: '14px',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center',
            color: '#fff', fontSize: '18px',
            fontWeight: 800, margin: '0 auto 12px'
          }}>
            &lt;/&gt;
          </div>
          <h1 style={{
            fontSize: '20px', fontWeight: 800,
            color: '#1a1a1a', marginBottom: '4px'
          }}>
            DevTrack AI
          </h1>
          <p style={{ color: '#9a9a8e', fontSize: '13px', margin: 0 }}>
            Sign in to your account
          </p>
        </div>

        <form onSubmit={handleSubmit}>

          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block', fontSize: '12px',
              fontWeight: 700, color: '#555',
              marginBottom: '6px', textTransform: 'uppercase',
              letterSpacing: '0.04em'
            }}>
              Email
            </label>
            <input
              type="email" name="email"
              className="inp"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block', fontSize: '12px',
              fontWeight: 700, color: '#555',
              marginBottom: '6px', textTransform: 'uppercase',
              letterSpacing: '0.04em'
            }}>
              Password
            </label>
            <input
              type="password" name="password"
              className="inp"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="btn-green"
            disabled={loading}
            style={{
              width: '100%',
              justifyContent: 'center',
              padding: '12px',
              fontSize: '14px',
              opacity: loading ? 0.7 : 1
            }}>
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>

        </form>

        <p style={{
          textAlign: 'center', marginTop: '20px',
          color: '#9a9a8e', fontSize: '13px'
        }}>
          Don't have an account?{' '}
          <Link to="/register" style={{
            color: '#2e7d52', fontWeight: 700,
            textDecoration: 'none'
          }}>
            Create Account
          </Link>
        </p>

      </div>
    </div>
  );
};

export default LoginPage;