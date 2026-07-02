import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUnreadCount } from '../utils/api';

const Navbar = () => {
  const { user, logoutUser, switchUserRole } = useAuth();
  const navigate = useNavigate();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      fetchUnreadCount();
      // Check every 30 seconds
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchUnreadCount = async () => {
    try {
      const res = await getUnreadCount();
      setUnreadCount(res.data.count);
    } catch (error) {
      console.log('Failed to fetch unread count');
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/');
    setMobileMenu(false);
  };

  const handleSwitchRole = async (role) => {
    const success = await switchUserRole(role);
    if (success) {
      setShowRoleMenu(false);
      setMobileMenu(false);
      navigate('/dashboard');
    }
  };

  const roleIcons = {
    graduate: '🎓',
    employer: '💼',
    alumni: '🤝'
  };

  return (
    <nav style={{
      background: 'rgba(10, 15, 30, 0.95)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(0, 212, 170, 0.15)',
      padding: '0 20px',
      height: '70px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
    }}>
      {/* Logo */}
      <Link to='/' style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        textDecoration: 'none'
      }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #00d4aa, #6c63ff)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px',
          flexShrink: 0
        }}>
          🎓
        </div>
        <span style={{
          fontSize: '16px',
          fontWeight: '800',
          background: 'linear-gradient(135deg, #00d4aa, #6c63ff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          FutMinna Job Portal
        </span>
      </Link>

      {/* Desktop Nav Links */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        '@media (max-width: 768px)': { display: 'none' }
      }} className='desktop-nav'>
        <Link to='/jobs' style={{
          color: 'rgba(255,255,255,0.7)',
          fontSize: '14px',
          fontWeight: '500',
          textDecoration: 'none'
        }}
          onMouseEnter={e => e.target.style.color = '#00d4aa'}
          onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.7)'}
        >
          Browse Jobs
        </Link>

        {user ? (
          <>
            <Link to='/dashboard' style={{
              color: 'rgba(255,255,255,0.7)',
              fontSize: '14px',
              fontWeight: '500',
              textDecoration: 'none'
            }}
              onMouseEnter={e => e.target.style.color = '#00d4aa'}
              onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.7)'}
            >
              Dashboard
            </Link>

            <Link to='/messages' style={{
              color: 'rgba(255,255,255,0.7)',
              fontSize: '14px',
              fontWeight: '500',
              textDecoration: 'none',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
              onMouseEnter={e => e.currentTarget.style.color = '#00d4aa'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
            >
              Messages
              {unreadCount > 0 && (
                <span style={{
                  background: 'linear-gradient(135deg, #ff4757, #ff3742)',
                  color: 'white',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  fontSize: '11px',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  animation: 'pulse 2s infinite'
                }}>
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </Link>

            <Link to='/profile' style={{
              color: 'rgba(255,255,255,0.7)',
              fontSize: '14px',
              fontWeight: '500',
              textDecoration: 'none'
            }}
              onMouseEnter={e => e.target.style.color = '#00d4aa'}
              onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.7)'}
            >
              Profile
            </Link>

            {/* Role Switcher */}
            {user.roles?.length > 0 && (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowRoleMenu(!showRoleMenu)}
                  style={{
                    background: 'rgba(0, 212, 170, 0.1)',
                    color: '#00d4aa',
                    border: '1px solid rgba(0, 212, 170, 0.3)',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  {roleIcons[user.activeRole]} {user.activeRole?.charAt(0).toUpperCase() + user.activeRole?.slice(1)} ▾
                </button>

                {showRoleMenu && (
                  <div style={{
                    position: 'absolute',
                    top: '45px',
                    right: '0',
                    background: 'rgba(15, 20, 40, 0.98)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(0, 212, 170, 0.2)',
                    borderRadius: '12px',
                    minWidth: '200px',
                    overflow: 'hidden',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                    animation: 'fadeInUp 0.2s ease'
                  }}>
                    <p style={{
                      padding: '12px 16px',
                      color: 'rgba(255,255,255,0.4)',
                      fontSize: '11px',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      borderBottom: '1px solid rgba(255,255,255,0.06)'
                    }}>
                      Switch Role
                    </p>
                    {user.roles?.map((role) => (
                      <div
                        key={role}
                        onClick={() => handleSwitchRole(role)}
                        style={{
                          padding: '12px 16px',
                          cursor: 'pointer',
                          color: user.activeRole === role ? '#00d4aa' : 'rgba(255,255,255,0.7)',
                          backgroundColor: user.activeRole === role ? 'rgba(0, 212, 170, 0.08)' : 'transparent',
                          fontWeight: user.activeRole === role ? '600' : '400',
                          fontSize: '14px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          transition: 'all 0.2s'
                        }}
                      >
                        {roleIcons[role]} {role?.charAt(0).toUpperCase() + role?.slice(1)}
                        {user.activeRole === role && <span style={{ marginLeft: 'auto' }}>✓</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* User Avatar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #00d4aa, #6c63ff)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '14px',
                flexShrink: 0
              }}>
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <span style={{
                color: 'rgba(255,255,255,0.8)',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                {user.name?.split(' ')[0]}
              </span>
            </div>

            <button
              onClick={handleLogout}
              style={{
                background: 'rgba(255, 71, 87, 0.1)',
                color: '#ff4757',
                border: '1px solid rgba(255, 71, 87, 0.3)',
                padding: '8px 16px',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '13px'
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to='/login' style={{
              color: 'rgba(255,255,255,0.7)',
              fontSize: '14px',
              fontWeight: '500',
              textDecoration: 'none'
            }}>
              Login
            </Link>
            <Link to='/register' style={{
              background: 'linear-gradient(135deg, #00d4aa, #6c63ff)',
              color: 'white',
              padding: '8px 20px',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '14px',
              textDecoration: 'none'
            }}>
              Get Started
            </Link>
          </>
        )}
      </div>

      {/* Mobile Hamburger */}
      <button
        onClick={() => setMobileMenu(!mobileMenu)}
        style={{
          display: 'none',
          background: 'transparent',
          border: 'none',
          color: 'white',
          fontSize: '24px',
          cursor: 'pointer'
        }}
        className='mobile-menu-btn'
      >
        {mobileMenu ? '✕' : '☰'}
      </button>

      {/* Mobile Menu */}
      {mobileMenu && (
        <div style={{
          position: 'fixed',
          top: '70px',
          left: 0,
          right: 0,
          background: 'rgba(10, 15, 30, 0.98)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0, 212, 170, 0.15)',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          animation: 'fadeInUp 0.3s ease',
          zIndex: 999
        }}>
          <Link to='/jobs' onClick={() => setMobileMenu(false)} style={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px', textDecoration: 'none' }}>Browse Jobs</Link>
          {user ? (
            <>
              <Link to='/dashboard' onClick={() => setMobileMenu(false)} style={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px', textDecoration: 'none' }}>Dashboard</Link>
              <Link to='/messages' onClick={() => setMobileMenu(false)} style={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px', textDecoration: 'none' }}>Messages</Link>
              {user.roles?.map((role) => (
                <button
                  key={role}
                  onClick={() => handleSwitchRole(role)}
                  style={{
                    background: user.activeRole === role ? 'rgba(0, 212, 170, 0.1)' : 'transparent',
                    color: user.activeRole === role ? '#00d4aa' : 'rgba(255,255,255,0.7)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    textAlign: 'left'
                  }}
                >
                  {roleIcons[role]} Switch to {role}
                </button>
              ))}
              <button onClick={handleLogout} style={{ background: 'rgba(255, 71, 87, 0.1)', color: '#ff4757', border: '1px solid rgba(255, 71, 87, 0.3)', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to='/login' onClick={() => setMobileMenu(false)} style={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px', textDecoration: 'none' }}>Login</Link>
              <Link to='/register' onClick={() => setMobileMenu(false)} style={{ background: 'linear-gradient(135deg, #00d4aa, #6c63ff)', color: 'white', padding: '12px 20px', borderRadius: '8px', fontWeight: '600', fontSize: '14px', textDecoration: 'none', textAlign: 'center' }}>Get Started</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;