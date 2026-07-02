import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getAllJobs } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await getAllJobs();
      setJobs(res.data);
    } catch (error) {
      toast.error('Failed to fetch jobs');
    }
    setLoading(false);
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.companyName?.toLowerCase().includes(search.toLowerCase()) ||
      job.location?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || job.jobType === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className='page'>
      <div className='container'>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '40px',
          animation: 'fadeInUp 0.6s ease forwards'
        }}>
          <h1 style={{
            fontSize: '40px',
            fontWeight: '800',
            marginBottom: '12px'
          }}>
            Browse{' '}
            <span style={{
              background: 'linear-gradient(135deg, #00d4aa, #6c63ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Job Opportunities
            </span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '16px' }}>
            {jobs.length} jobs available for FUT Minna graduates
          </p>
        </div>

        {/* Search and Filter */}
        <div className='card' style={{
          padding: '20px',
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          <input
            type='text'
            placeholder='🔍 Search by title, company or location...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: 1,
              minWidth: '200px',
              padding: '12px 16px',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '10px',
              color: 'white',
              fontSize: '14px',
              outline: 'none'
            }}
          />
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['all', 'full-time', 'part-time', 'internship', 'contract'].map(type => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: filter === type ? 'none' : '1px solid rgba(255,255,255,0.12)',
                  background: filter === type ? 'linear-gradient(135deg, #00d4aa, #6c63ff)' : 'transparent',
                  color: filter === type ? 'white' : 'rgba(255,255,255,0.5)',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '600',
                  transition: 'all 0.3s'
                }}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Jobs List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <div className='spinner' />
            <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '16px' }}>Loading jobs...</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '18px' }}>No jobs found</p>
          </div>
        ) : (
          filteredJobs.map((job, index) => (
            <div key={job._id} className='card' style={{
              animationDelay: `${index * 0.05}s`
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'white' }}>
                      {job.title}
                    </h3>
                    <span style={{
                      padding: '3px 10px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600',
                      background: 'rgba(0, 212, 170, 0.1)',
                      color: '#00d4aa',
                      border: '1px solid rgba(0, 212, 170, 0.2)'
                    }}>
                      {job.jobType}
                    </span>
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginBottom: '12px' }}>
                    🏢 {job.companyName} &nbsp;|&nbsp; 📍 {job.location}
                    {job.salary && <>&nbsp;|&nbsp; 💰 {job.salary}</>}
                  </p>
                  <p style={{
                    color: 'rgba(255,255,255,0.6)',
                    fontSize: '14px',
                    lineHeight: '1.7',
                    marginBottom: '16px'
                  }}>
                    {job.description}
                  </p>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {job.requirements?.map((req, i) => (
                      <span key={i} className='tag'>{req}</span>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <div>
                  {user?.activeRole === 'graduate' ? (
                    <button
                      className='btn btn-primary'
                      onClick={() => navigate('/dashboard')}
                      style={{ whiteSpace: 'nowrap', padding: '10px 20px' }}
                    >
                      <span>Apply via AI →</span>
                    </button>
                  ) : !user ? (
                    <button
                      className='btn btn-primary'
                      onClick={() => navigate('/register')}
                      style={{ whiteSpace: 'nowrap', padding: '10px 20px' }}
                    >
                      <span>Register to Apply →</span>
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Jobs;