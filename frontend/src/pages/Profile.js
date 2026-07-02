import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Profile = () => {
  const { user, token, loginUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    skills: '',
    department: '',
    graduationYear: '',
    companyName: '',
    companyDescription: '',
    github: '',
    linkedin: '',
    portfolio: '',
    phone: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        bio: user.bio || '',
        skills: user.skills?.join(', ') || '',
        department: user.department || '',
        graduationYear: user.graduationYear || '',
        companyName: user.companyName || '',
        companyDescription: user.companyDescription || '',
        github: user.github || '',
        linkedin: user.linkedin || '',
        portfolio: user.portfolio || '',
        phone: user.phone || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const dataToSend = {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()).filter(s => s)
      };
      const res = await axios.put('http://localhost:5000/api/auth/profile', dataToSend, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Refresh user in context
      const userRes = await axios.get('http://localhost:5000/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      loginUser(token, userRes.data);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }
    setLoading(false);
  };

  return (
    <div className='page'>
      <div className='container' style={{ maxWidth: '700px' }}>
        <div style={{ marginBottom: '32px', animation: 'fadeInUp 0.6s ease forwards' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px' }}>
            Edit{' '}
            <span style={{
              background: 'linear-gradient(135deg, #00d4aa, #6c63ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Profile
            </span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.4)' }}>
            Update your personal information and professional details
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Basic Info */}
          <div className='card'>
            <h3 style={{ marginBottom: '20px', color: '#00d4aa', fontSize: '16px', fontWeight: '700' }}>
              👤 Basic Information
            </h3>
            <div className='form-group'>
              <label>Full Name</label>
              <input
                type='text'
                name='name'
                value={formData.name}
                onChange={handleChange}
                placeholder='Your full name'
              />
            </div>
            <div className='form-group'>
              <label>Bio / About Me</label>
              <textarea
                name='bio'
                value={formData.bio}
                onChange={handleChange}
                placeholder='Tell employers and alumni about yourself...'
                rows='4'
              />
            </div>
            <div className='form-group'>
              <label>Phone Number</label>
              <input
                type='text'
                name='phone'
                value={formData.phone}
                onChange={handleChange}
                placeholder='e.g. +234 801 234 5678'
              />
            </div>
          </div>

          {/* Academic Info */}
          {(user?.roles?.includes('graduate') || user?.roles?.includes('alumni')) && (
            <div className='card'>
              <h3 style={{ marginBottom: '20px', color: '#00d4aa', fontSize: '16px', fontWeight: '700' }}>
                🎓 Academic Information
              </h3>
              <div className='form-group'>
                <label>Skills (comma separated)</label>
                <input
                  type='text'
                  name='skills'
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder='e.g. Python, Excel, AutoCAD, JavaScript'
                />
              </div>
              <div className='form-group'>
                <label>Department</label>
                <input
                  type='text'
                  name='department'
                  value={formData.department}
                  onChange={handleChange}
                  placeholder='e.g. Computer Science'
                />
              </div>
              <div className='form-group'>
                <label>Graduation Year</label>
                <input
                  type='text'
                  name='graduationYear'
                  value={formData.graduationYear}
                  onChange={handleChange}
                  placeholder='e.g. 2023'
                />
              </div>
            </div>
          )}

          {/* Employer Info */}
          {user?.roles?.includes('employer') && (
            <div className='card'>
              <h3 style={{ marginBottom: '20px', color: '#6c63ff', fontSize: '16px', fontWeight: '700' }}>
                💼 Company Information
              </h3>
              <div className='form-group'>
                <label>Company Name</label>
                <input
                  type='text'
                  name='companyName'
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder='Your company name'
                />
              </div>
              <div className='form-group'>
                <label>Company Description</label>
                <textarea
                  name='companyDescription'
                  value={formData.companyDescription}
                  onChange={handleChange}
                  placeholder='Describe your company'
                  rows='3'
                />
              </div>
            </div>
          )}

          {/* Social Links */}
          <div className='card'>
            <h3 style={{ marginBottom: '20px', color: '#00d4aa', fontSize: '16px', fontWeight: '700' }}>
              🔗 Professional Links
            </h3>
            <div className='form-group'>
              <label>GitHub Profile</label>
              <input
                type='text'
                name='github'
                value={formData.github}
                onChange={handleChange}
                placeholder='https://github.com/yourusername'
              />
            </div>
            <div className='form-group'>
              <label>LinkedIn Profile</label>
              <input
                type='text'
                name='linkedin'
                value={formData.linkedin}
                onChange={handleChange}
                placeholder='https://linkedin.com/in/yourusername'
              />
            </div>
            <div className='form-group'>
              <label>Portfolio Website</label>
              <input
                type='text'
                name='portfolio'
                value={formData.portfolio}
                onChange={handleChange}
                placeholder='https://yourportfolio.com'
              />
            </div>
          </div>

          <button
            type='submit'
            className='btn btn-primary'
            style={{ width: '100%', padding: '14px', fontSize: '16px', borderRadius: '10px' }}
            disabled={loading}
          >
            <span>{loading ? '⏳ Saving...' : 'Save Profile →'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;