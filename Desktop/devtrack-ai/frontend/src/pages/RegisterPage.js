import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = formData;
    if (!name || !email || !password || !confirmPassword) {
      toast.error('Please fill in all fields'); return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match'); return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters'); return;
    }
    setLoading(true);
    try {
      await register({ name, email, password });
      toast.success('Welcome to DevTrack AI!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { label: 'Full Name',        name: 'name',            type: 'text',     placeholder: 'Your name' },
    { label: 'Email',            name: 'email',           type: 'email',    placeholder: 'you@example.com' },
    { label: 'Password',         name: 'password',        type: 'password', placeholder: '••••••••' },
    { label: 'Confirm Password', name: 'confirmPassword', type: 'password', placeholder: '••••••••' },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: '#eeeee6',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>

      <div style={{
        background: '#fff',
        borderRadius: '20px',
        padding: '44px 40px',
        width: '100%',
        maxWidth: '420px',
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
            Create Account
          </h1>
          <p style={{ color: '#9a9a8e', fontSize: '13px', margin: 0 }}>
            Join DevTrack AI today
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {fields.map(f => (
            <div key={f.name} style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block', fontSize: '12px',
                fontWeight: 700, color: '#555',
                marginBottom: '6px', textTransform: 'uppercase',
                letterSpacing: '0.04em'
              }}>
                {f.label}
              </label>
              <input
                type={f.type}
                name={f.name}
                className="inp"
                placeholder={f.placeholder}
                value={formData[f.name]}
                onChange={handleChange}
              />
            </div>
          ))}

          <button
            type="submit"
            className="btn-green"
            disabled={loading}
            style={{
              width: '100%',
              justifyContent: 'center',
              padding: '12px',
              fontSize: '14px',
              marginTop: '8px',
              opacity: loading ? 0.7 : 1
            }}>
            {loading ? 'Creating Account...' : 'Create Account →'}
          </button>
        </form>

        <p style={{
          textAlign: 'center', marginTop: '20px',
          color: '#9a9a8e', fontSize: '13px'
        }}>
          Already have an account?{' '}
          <Link to="/login" style={{
            color: '#2e7d52', fontWeight: 700,
            textDecoration: 'none'
          }}>
            Sign In
          </Link>
        </p>

      </div>
    </div>
  );
};

export default RegisterPage;