import React, { useState } from 'react';
import { adminLogin } from '../hooks/useApi';
import './AdminLogin.css';

export default function AdminLogin({ onLogin }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      setError('Please enter your username and password.');
      return;
    }
    setLoading(true);
    try {
      const data = await adminLogin(form);
      localStorage.setItem('admin_token', data.token);
      localStorage.setItem('admin_user', data.username);
      onLogin(data);
    } catch (err) {
      setError(err.error || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-brand">
          <span className="admin-brand-word">Serenity</span>
          <span className="admin-brand-sub">Guest House · Admin</span>
        </div>

        <h1 className="admin-login-title">Sign In</h1>
        <p className="admin-login-sub">Staff access only.</p>

        <form onSubmit={handleSubmit} noValidate className="admin-login-form">
          {error && <div className="alert alert-error">{error}</div>}

          <div className="form-group">
            <label className="form-label" htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              className="form-input"
              value={form.username}
              onChange={handleChange}
              autoComplete="username"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              className="form-input"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="btn-primary admin-login-btn" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
