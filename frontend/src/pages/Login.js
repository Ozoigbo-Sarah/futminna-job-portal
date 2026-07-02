import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { login } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(formData);
      loginUser(res.data.token, res.data.user);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 70px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative'
    }}>
      {/* Glow Effects */}
      <div style={{
        position: 'fixed',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,212,170,0.06) 0%, transparent 70%)',
        top: '20%',
        left: '20%',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'fixed',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(108,99,255,0.06) 0%, transparent 70%)',
        bottom: '20%',
        right: '20%',
        pointerEvents: 'none'
      }} />

      <div style={{
        width: '100%',
        maxWidth: '440px',
        animation: 'fadeInUp 0.6s ease forwards'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #00d4aa, #6c63ff)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px',
            margin: '0 auto 16px'
          }}>
            🎓
          </div>
          <h2 style={{
            fontSize: '28px',
            fontWeight: '800',
            marginBottom: '8px'
          }}>
            Welcome Back
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '15px' }}>
            Sign in to your FutMinna Job Portal account
          </p>
        </div>

        {/* Form Card */}
        <div className='card' style={{ padding: '32px' }}>
          <form onSubmit={handleSubmit}>
            <div className='form-group'>
              <label>Email Address</label>
              <input
                type='email'
                name='email'
                placeholder='Enter your email'
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className='form-group'>
              <label>Password</label>
              <input
                type='password'
                name='password'
                placeholder='Enter your password'
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <button
              type='submit'
              className='btn btn-primary'
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '15px',
                marginTop: '8px',
                borderRadius: '10px'
              }}
              disabled={loading}
            >
              <span>{loading ? '⏳ Signing in...' : 'Sign In →'}</span>
            </button>
          </form>

          <div style={{
            textAlign: 'center',
            marginTop: '24px',
            paddingTop: '24px',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            color: 'rgba(255,255,255,0.4)',
            fontSize: '14px'
          }}>
            Don't have an account?{' '}
            <Link to='/register' style={{
              color: '#00d4aa',
              fontWeight: '600',
              textDecoration: 'none'
            }}>
              Create one free →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;