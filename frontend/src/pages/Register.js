import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { register } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    skills: '',
    department: '',
    graduationYear: '',
    companyName: '',
    companyDescription: ''
  });
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleToggle = (role) => {
    if (selectedRoles.includes(role)) {
      setSelectedRoles(selectedRoles.filter(r => r !== role));
    } else {
      setSelectedRoles([...selectedRoles, role]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedRoles.length === 0) {
      toast.error('Please select at least one role');
      return;
    }
    setLoading(true);
    try {
      const dataToSend = {
        ...formData,
        roles: selectedRoles,
        skills: formData.skills.split(',').map(s => s.trim()).filter(s => s)
      };
      const res = await register(dataToSend);
      loginUser(res.data.token, res.data.user);
      toast.success('Welcome to FutMinna Job Portal!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    }
    setLoading(false);
  };

  const roles = [
    {
      id: 'graduate',
      icon: '🎓',
      title: 'Graduate',
      description: 'Looking for jobs',
      color: '0, 212, 170'
    },
    {
      id: 'employer',
      icon: '💼',
      title: 'Employer',
      description: 'Hiring candidates',
      color: '108, 99, 255'
    },
    {
      id: 'alumni',
      icon: '🤝',
      title: 'Alumni Mentor',
      description: 'Offering mentorship',
      color: '0, 212, 170'
    }
  ];

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
        top: '10%',
        left: '10%',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'fixed',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(108,99,255,0.06) 0%, transparent 70%)',
        bottom: '10%',
        right: '10%',
        pointerEvents: 'none'
      }} />

      <div style={{
        width: '100%',
        maxWidth: '560px',
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
            Create Your Account
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '15px' }}>
            One account for everything on FutMinna Job Portal
          </p>
        </div>

        {/* Form Card */}
        <div className='card' style={{ padding: '32px' }}>
          <form onSubmit={handleSubmit}>
            {/* Basic Info */}
            <div className='form-group'>
              <label>Full Name</label>
              <input
                type='text'
                name='name'
                placeholder='Enter your full name'
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className='form-group'>
              <label>Email Address</label>
              <input
                type='email'
                name='email'
                placeholder='Enter your email address'
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
                placeholder='Create a strong password'
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {/* Role Selection */}
            <div className='form-group'>
              <label>Select Your Role(s)</label>
              <p style={{
                color: 'rgba(255,255,255,0.3)',
                fontSize: '12px',
                marginBottom: '12px',
                marginTop: '-4px'
              }}>
                You can select more than one role
              </p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {roles.map((role) => (
                  <div
                    key={role.id}
                    onClick={() => handleRoleToggle(role.id)}
                    style={{
                      flex: 1,
                      minWidth: '140px',
                      padding: '16px',
                      borderRadius: '12px',
                      border: selectedRoles.includes(role.id)
                        ? `2px solid rgba(${role.color}, 0.8)`
                        : '2px solid rgba(255,255,255,0.08)',
                      backgroundColor: selectedRoles.includes(role.id)
                        ? `rgba(${role.color}, 0.1)`
                        : 'rgba(255,255,255,0.02)',
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.3s'
                    }}
                  >
                    <div style={{ fontSize: '28px', marginBottom: '8px' }}>{role.icon}</div>
                    <h4 style={{
                      color: selectedRoles.includes(role.id) ? `rgba(${role.color}, 1)` : 'white',
                      marginBottom: '4px',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}>
                      {role.title}
                    </h4>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>
                      {role.description}
                    </p>
                    {selectedRoles.includes(role.id) && (
                      <div style={{
                        marginTop: '8px',
                        color: `rgba(${role.color}, 1)`,
                        fontSize: '16px'
                      }}>✓</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Graduate/Alumni Fields */}
            {(selectedRoles.includes('graduate') || selectedRoles.includes('alumni')) && (
              <div style={{
                padding: '20px',
                background: 'rgba(0, 212, 170, 0.05)',
                borderRadius: '12px',
                border: '1px solid rgba(0, 212, 170, 0.15)',
                marginBottom: '20px'
              }}>
                <p style={{ color: '#00d4aa', fontSize: '13px', fontWeight: '600', marginBottom: '16px' }}>
                  🎓 Graduate / Alumni Details
                </p>
                <div className='form-group'>
                  <label>Skills (comma separated)</label>
                  <input
                    type='text'
                    name='skills'
                    placeholder='e.g. Python, Excel, AutoCAD, JavaScript'
                    value={formData.skills}
                    onChange={handleChange}
                  />
                </div>
                <div className='form-group'>
                  <label>Department</label>
                  <input
                    type='text'
                    name='department'
                    placeholder='e.g. Computer Science'
                    value={formData.department}
                    onChange={handleChange}
                  />
                </div>
                <div className='form-group' style={{ marginBottom: 0 }}>
                  <label>Graduation Year</label>
                  <input
                    type='text'
                    name='graduationYear'
                    placeholder='e.g. 2023'
                    value={formData.graduationYear}
                    onChange={handleChange}
                  />
                </div>
              </div>
            )}

            {/* Employer Fields */}
            {selectedRoles.includes('employer') && (
              <div style={{
                padding: '20px',
                background: 'rgba(108, 99, 255, 0.05)',
                borderRadius: '12px',
                border: '1px solid rgba(108, 99, 255, 0.15)',
                marginBottom: '20px'
              }}>
                <p style={{ color: '#6c63ff', fontSize: '13px', fontWeight: '600', marginBottom: '16px' }}>
                  💼 Employer Details
                </p>
                <div className='form-group'>
                  <label>Company Name</label>
                  <input
                    type='text'
                    name='companyName'
                    placeholder='Enter your company name'
                    value={formData.companyName}
                    onChange={handleChange}
                  />
                </div>
                <div className='form-group' style={{ marginBottom: 0 }}>
                  <label>Company Description</label>
                  <textarea
                    name='companyDescription'
                    placeholder='Briefly describe your company'
                    value={formData.companyDescription}
                    onChange={handleChange}
                    rows='3'
                  />
                </div>
              </div>
            )}

            <button
              type='submit'
              className='btn btn-primary'
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '15px',
                borderRadius: '10px'
              }}
              disabled={loading}
            >
              <span>{loading ? '⏳ Creating account...' : 'Create Account →'}</span>
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
            Already have an account?{' '}
            <Link to='/login' style={{
              color: '#00d4aa',
              fontWeight: '600',
              textDecoration: 'none'
            }}>
              Sign in →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;