import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { matchJobs, getAllJobs, uploadResume, applyForJob, getMyApplications, createJob, deleteJob, getJobApplications, updateApplicationStatus, getConversations, updateJobStatus } from '../utils/api';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, switchUserRole, addUserRole } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [jobs, setJobs] = useState([]);
  const [matches, setMatches] = useState([]);
  const [applications, setApplications] = useState([]);
  const [employerApplications, setEmployerApplications] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [loadingMatch, setLoadingMatch] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [resumeData, setResumeData] = useState(null);
  const [applying, setApplying] = useState(null);
  const [showAddRole, setShowAddRole] = useState(false);
  const [jobFilter, setJobFilter] = useState('all');
  const [jobForm, setJobForm] = useState({
    title: '',
    description: '',
    requirements: '',
    location: '',
    salary: '',
    jobType: 'full-time'
  });
  const [addRoleForm, setAddRoleForm] = useState({
    role: '',
    companyName: '',
    companyDescription: ''
  });

  useEffect(() => {
    fetchJobs();
    if (user?.activeRole === 'graduate') fetchMyApplications();
    if (user?.activeRole === 'employer') fetchEmployerApplications();
    if (user?.activeRole === 'alumni') fetchConversations();
  }, [user?.activeRole]);

  const fetchJobs = async () => {
    setLoadingJobs(true);
    try {
      const res = await getAllJobs();
      setJobs(res.data);
    } catch (error) {
      toast.error('Failed to fetch jobs');
    }
    setLoadingJobs(false);
  };

  const fetchMyApplications = async () => {
    try {
      const res = await getMyApplications();
      setApplications(res.data);
    } catch (error) {
      console.log('Failed to fetch applications');
    }
  };

  const fetchEmployerApplications = async () => {
    try {
      const res = await getJobApplications();
      setEmployerApplications(res.data);
    } catch (error) {
      console.log('Failed to fetch employer applications');
    }
  };

  const fetchConversations = async () => {
    try {
      const res = await getConversations();
      setConversations(res.data);
    } catch (error) {
      console.log('Failed to fetch conversations');
    }
  };

  const handleMatchJobs = async () => {
    setLoadingMatch(true);
    try {
      const res = await matchJobs();
      setMatches(res.data.matches);
      toast.success('AI matching complete!');
      setActiveTab('matches');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Matching failed');
    }
    setLoadingMatch(false);
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('resume', file);
      const res = await uploadResume(formData);
      setResumeData(res.data.extractedData);
      toast.success('Resume uploaded and analyzed by AI!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Resume upload failed');
    }
    setUploading(false);
  };

  const handleApply = async (jobId) => {
    setApplying(jobId);
    try {
      await applyForJob({ jobId });
      toast.success('Application submitted successfully!');
      fetchMyApplications();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Application failed');
    }
    setApplying(null);
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...jobForm,
        requirements: jobForm.requirements.split(',').map(r => r.trim()).filter(r => r)
      };
      await createJob(dataToSend);
      toast.success('Job posted successfully!');
      setJobForm({ title: '', description: '', requirements: '', location: '', salary: '', jobType: 'full-time' });
      fetchJobs();
      setActiveTab('myjobs');
    } catch (error) {
      toast.error('Failed to post job');
    }
  };

  const handleDeleteJob = async (id) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await deleteJob(id);
        toast.success('Job deleted!');
        fetchJobs();
      } catch (error) {
        toast.error('Failed to delete job');
      }
    }
  };

  const handleJobStatus = async (id, status) => {
    try {
      await updateJobStatus(id, { status });
      toast.success(`Job ${status} successfully!`);
      fetchJobs();
    } catch (error) {
      toast.error('Failed to update job status');
    }
  };

  const handleAddRole = async (e) => {
    e.preventDefault();
    try {
      const success = await addUserRole(addRoleForm);
      if (success) {
        toast.success('Role added successfully!');
        setShowAddRole(false);
        setAddRoleForm({ role: '', companyName: '', companyDescription: '' });
      } else {
        toast.error('Failed to add role');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add role');
    }
  };

  const roleIcons = { graduate: '🎓', employer: '💼', alumni: '🤝' };

  const tabStyle = (tab) => ({
    padding: '12px 20px',
    border: 'none',
    borderBottom: activeTab === tab ? '2px solid #00d4aa' : '2px solid transparent',
    backgroundColor: 'transparent',
    color: activeTab === tab ? '#00d4aa' : 'rgba(255,255,255,0.75)',
    fontWeight: activeTab === tab ? '700' : '500',
    fontSize: '14px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'all 0.3s'
  });

  const myJobs = jobs.filter(job => job.employer?._id === user?._id || job.employer === user?._id);

  const statCard = (value, label, color) => (
    <div style={{
      background: 'rgba(255,255,255,0.06)',
      border: '1px solid rgba(255,255,255,0.12)',
      borderRadius: '16px',
      padding: '24px',
      textAlign: 'center',
      flex: 1,
      minWidth: '140px'
    }}>
      <h2 style={{
        fontSize: '36px',
        fontWeight: '800',
        background: color || 'linear-gradient(135deg, #00d4aa, #6c63ff)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      }}>
        {value}
      </h2>
      <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '14px', fontWeight: '600', marginTop: '6px' }}>{label}</p>
    </div>
  );

  return (
    <div className='page'>
      <div className='container'>

        {/* Header Card */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(0,212,170,0.15), rgba(108,99,255,0.15))',
          border: '1px solid rgba(0,212,170,0.2)',
          borderRadius: '20px',
          padding: '28px',
          marginBottom: '20px',
          animation: 'fadeInUp 0.6s ease forwards'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h1 style={{ fontSize: '26px', fontWeight: '800', marginBottom: '6px' }}>
                Welcome back, {user?.name?.split(' ')[0]}! 👋
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginBottom: '16px' }}>
                {user?.activeRole === 'graduate' && `${user?.department} | Class of ${user?.graduationYear}`}
                {user?.activeRole === 'employer' && `${user?.companyName} — Employer Dashboard`}
                {user?.activeRole === 'alumni' && `${user?.department} | Alumni Mentor`}
              </p>

              {/* Role Badges */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {user?.roles?.map((role, index) => (
                  <span
                    key={index}
                    onClick={() => switchUserRole(role)}
                    style={{
                      background: user?.activeRole === role
                        ? 'linear-gradient(135deg, #00d4aa, #6c63ff)'
                        : 'rgba(255,255,255,0.06)',
                      color: user?.activeRole === role ? 'white' : 'rgba(255,255,255,0.5)',
                      padding: '6px 14px',
                      borderRadius: '20px',
                      fontSize: '13px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      border: user?.activeRole === role ? 'none' : '1px solid rgba(255,255,255,0.1)',
                      transition: 'all 0.3s'
                    }}
                  >
                    {roleIcons[role]} {role?.charAt(0).toUpperCase() + role?.slice(1)}
                  </span>
                ))}
                <span
                  onClick={() => setShowAddRole(!showAddRole)}
                  style={{
                    background: 'rgba(0,212,170,0.08)',
                    color: '#00d4aa',
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontSize: '13px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    border: '1px solid rgba(0,212,170,0.2)',
                    transition: 'all 0.3s'
                  }}
                >
                  + Add Role
                </span>
              </div>
            </div>

            {/* Profile Button */}
            <button
              onClick={() => navigate('/profile')}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.7)',
                padding: '8px 16px',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '600'
              }}
            >
              ✏️ Edit Profile
            </button>
          </div>

          {/* Add Role Form */}
          {showAddRole && (
            <div style={{
              marginTop: '20px',
              background: 'rgba(0,0,0,0.2)',
              padding: '16px',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.08)'
            }}>
              <h4 style={{ marginBottom: '12px', fontSize: '14px', color: '#00d4aa' }}>Add a New Role</h4>
              <form onSubmit={handleAddRole}>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <select
                    value={addRoleForm.role}
                    onChange={(e) => setAddRoleForm({ ...addRoleForm, role: e.target.value })}
                    style={{
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255,255,255,0.1)',
                      background: '#1a1f35',
                      color: 'white',
                      flex: 1,
                      minWidth: '150px'
                    }}
                  >
                    <option value=''>Select role to add</option>
                    {['graduate', 'employer', 'alumni']
                      .filter(r => !user?.roles?.includes(r))
                      .map(r => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                  </select>
                  {addRoleForm.role === 'employer' && (
                    <input
                      type='text'
                      placeholder='Company Name'
                      value={addRoleForm.companyName}
                      onChange={(e) => setAddRoleForm({ ...addRoleForm, companyName: e.target.value })}
                      style={{
                        padding: '10px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        background: 'rgba(255,255,255,0.06)',
                        color: 'white',
                        flex: 1,
                        minWidth: '150px'
                      }}
                    />
                  )}
                  <button
                    type='submit'
                    className='btn btn-primary'
                    style={{ padding: '10px 20px' }}
                  >
                    <span>Add Role</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Tabs Card */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '20px',
          overflow: 'hidden',
          animation: 'fadeInUp 0.6s ease 0.1s forwards',
          opacity: 0
        }}>
          {/* Tab Headers */}
          <div style={{
            display: 'flex',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch'
          }}>
            <button style={tabStyle('overview')} onClick={() => setActiveTab('overview')}>
              Overview
            </button>
            {user?.activeRole === 'graduate' && (
              <>
                <button style={tabStyle('jobs')} onClick={() => setActiveTab('jobs')}>
                  Jobs ({jobs.length})
                </button>
                <button style={tabStyle('matches')} onClick={() => setActiveTab('matches')}>
                  AI Matches ({matches.length})
                </button>
                <button style={tabStyle('myapplications')} onClick={() => setActiveTab('myapplications')}>
                  Applications ({applications.length})
                </button>
              </>
            )}
            {user?.activeRole === 'employer' && (
              <>
                <button style={tabStyle('postjob')} onClick={() => setActiveTab('postjob')}>
                  Post Job
                </button>
                <button style={tabStyle('myjobs')} onClick={() => setActiveTab('myjobs')}>
                  My Jobs ({myJobs.length})
                </button>
                <button style={tabStyle('applications')} onClick={() => setActiveTab('applications')}>
                  Applications ({employerApplications.length})
                </button>
              </>
            )}
            {user?.activeRole === 'alumni' && (
              <button style={tabStyle('messages')} onClick={() => setActiveTab('messages')}>
                Messages ({conversations.length})
              </button>
            )}
          </div>

          {/* Tab Content */}
          <div style={{ padding: '24px' }}>

            {/* ===== OVERVIEW TAB ===== */}
            {activeTab === 'overview' && (
              <div>
                {/* Stats */}
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '24px' }}>
                  {user?.activeRole === 'graduate' && (
                    <>
                      {statCard(jobs.length, 'Available Jobs')}
                      {statCard(user?.skills?.length || 0, 'Your Skills')}
                      {statCard(applications.length, 'Applications')}
                      {statCard(matches.length, 'AI Matches')}
                    </>
                  )}
                  {user?.activeRole === 'employer' && (
                    <>
                      {statCard(myJobs.length, 'Jobs Posted')}
                      {statCard(employerApplications.length, 'Applications')}
                      {statCard(employerApplications.filter(a => a.status === 'accepted').length, 'Accepted')}
                    </>
                  )}
                  {user?.activeRole === 'alumni' && (
                    <>
                      {statCard(conversations.length, 'Conversations')}
                      {statCard(user?.skills?.length || 0, 'Your Skills')}
                    </>
                  )}
                </div>

                {/* Graduate Resume Upload */}
                {user?.activeRole === 'graduate' && (
                  <div style={{
                    border: '2px dashed rgba(0,212,170,0.3)',
                    borderRadius: '16px',
                    padding: '32px',
                    textAlign: 'center',
                    marginBottom: '20px',
                    background: 'rgba(0,212,170,0.03)'
                  }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>📄</div>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>
                      Upload Your Resume
                    </h3>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginBottom: '24px' }}>
                      Upload your PDF resume and our AI will automatically extract your skills
                    </p>
                    <label style={{
                      background: 'linear-gradient(135deg, #00d4aa, #6c63ff)',
                      color: 'white',
                      padding: '12px 28px',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600',
                      display: 'inline-block'
                    }}>
                      {uploading ? '⏳ Analyzing...' : '📤 Upload Resume (PDF)'}
                      <input
                        type='file'
                        accept='.pdf'
                        onChange={handleResumeUpload}
                        style={{ display: 'none' }}
                        disabled={uploading}
                      />
                    </label>

                    {resumeData && (
                      <div style={{ marginTop: '24px', textAlign: 'left' }}>
                        <h4 style={{ color: '#00d4aa', marginBottom: '12px', fontSize: '14px', fontWeight: '700' }}>
                          ✅ AI Extracted from your Resume:
                        </h4>
                        <div style={{ marginBottom: '12px' }}>
                          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Skills</p>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {resumeData.skills?.map((skill, i) => (
                              <span key={i} className='tag'>{skill}</span>
                            ))}
                          </div>
                        </div>
                        {resumeData.education && (
                          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', marginBottom: '8px' }}>
                            <strong style={{ color: 'rgba(255,255,255,0.8)' }}>Education:</strong> {resumeData.education}
                          </p>
                        )}
                        {resumeData.experience && (
                          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>
                            <strong style={{ color: 'rgba(255,255,255,0.8)' }}>Experience:</strong> {resumeData.experience}
                          </p>
                        )}
                      </div>
                    )}

                    <div style={{ marginTop: '24px' }}>
                      <button
                        className='btn btn-primary'
                        onClick={handleMatchJobs}
                        disabled={loadingMatch}
                        style={{ padding: '12px 28px', fontSize: '15px' }}
                      >
                        <span>{loadingMatch ? '🤖 AI is matching...' : '🤖 Match My Jobs with AI'}</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Employer Quick Action */}
                {user?.activeRole === 'employer' && (
                  <div style={{ textAlign: 'center', padding: '32px' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>💼</div>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>
                      Ready to find the best candidates?
                    </h3>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginBottom: '24px' }}>
                      Post a job and our AI will match you with the best FUT Minna graduates
                    </p>
                    <button
                      className='btn btn-primary'
                      onClick={() => setActiveTab('postjob')}
                      style={{ padding: '12px 28px', fontSize: '15px' }}
                    >
                      <span>Post a Job Now →</span>
                    </button>
                  </div>
                )}

                {/* Alumni Quick Action */}
                {user?.activeRole === 'alumni' && (
                  <div style={{ textAlign: 'center', padding: '32px' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>🌟</div>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>
                      You are making a difference!
                    </h3>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginBottom: '24px' }}>
                      Check your messages to respond to graduates seeking guidance.
                    </p>
                    <button
                      className='btn btn-primary'
                      onClick={() => navigate('/messages')}
                      style={{ padding: '12px 28px', fontSize: '15px' }}
                    >
                      <span>View Messages →</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ===== ALL JOBS TAB (Graduate) ===== */}
            {activeTab === 'jobs' && user?.activeRole === 'graduate' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '700' }}>All Available Jobs</h3>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {['all', 'open', 'closed'].map(s => (
                      <button
                        key={s}
                        onClick={() => setJobFilter(s)}
                        style={{
                          padding: '6px 14px',
                          borderRadius: '8px',
                          border: jobFilter === s ? 'none' : '1px solid rgba(255,255,255,0.12)',
                          background: jobFilter === s ? 'linear-gradient(135deg, #00d4aa, #6c63ff)' : 'transparent',
                          color: jobFilter === s ? 'white' : 'rgba(255,255,255,0.5)',
                          cursor: 'pointer',
                          fontSize: '13px',
                          fontWeight: '600'
                        }}
                      >
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                {loadingJobs ? (
                  <div style={{ textAlign: 'center', padding: '40px' }}>
                    <div className='spinner' />
                  </div>
                ) : (
                  jobs
                    .filter(job => jobFilter === 'all' || job.status === jobFilter)
                    .map((job) => (
                      <div key={job._id} className='card'>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                          <h3 style={{ fontSize: '17px', fontWeight: '700' }}>{job.title}</h3>
                          <span style={{
                            padding: '3px 10px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '600',
                            background: job.status === 'open' ? 'rgba(0,212,170,0.1)' : 'rgba(255,71,87,0.1)',
                            color: job.status === 'open' ? '#00d4aa' : '#ff4757',
                            border: job.status === 'open' ? '1px solid rgba(0,212,170,0.2)' : '1px solid rgba(255,71,87,0.2)'
                          }}>
                            {job.status === 'open' ? '🟢 Open' : '🔴 Closed'}
                          </span>
                        </div>
                        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', marginBottom: '10px' }}>
                          🏢 {job.companyName} &nbsp;|&nbsp; 📍 {job.location} &nbsp;|&nbsp; 💼 {job.jobType}
                          {job.salary && <>&nbsp;|&nbsp; 💰 {job.salary}</>}
                        </p>
                        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', lineHeight: '1.7', marginBottom: '12px' }}>
                          {job.description}
                        </p>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          {job.requirements?.map((req, i) => (
                            <span key={i} className='tag'>{req}</span>
                          ))}
                        </div>
                        {(job.employer?._id === user?._id || job.employer === user?._id) && (
                          <div style={{ marginTop: '10px' }}>
                            <span style={{
                              padding: '4px 12px',
                              borderRadius: '6px',
                              fontSize: '12px',
                              fontWeight: '600',
                              background: 'rgba(108,99,255,0.1)',
                              color: '#6c63ff',
                              border: '1px solid rgba(108,99,255,0.2)'
                            }}>
                              👤 Your Job Posting
                            </span>
                          </div>
                        )}
                      </div>
                    ))
                )}
              </div>
            )}

            {/* ===== AI MATCHES TAB (Graduate) ===== */}
            {activeTab === 'matches' && user?.activeRole === 'graduate' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Your AI Matched Jobs</h3>
                  <button
                    className='btn btn-primary'
                    onClick={handleMatchJobs}
                    disabled={loadingMatch}
                    style={{ padding: '8px 20px', fontSize: '13px' }}
                  >
                    <span>{loadingMatch ? '🤖 Matching...' : '🤖 Rematch'}</span>
                  </button>
                </div>
                {matches.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '48px' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>🤖</div>
                    <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '20px' }}>
                      No matches yet. Let AI find your perfect jobs!
                    </p>
                    <button className='btn btn-primary' onClick={handleMatchJobs} disabled={loadingMatch}>
                      <span>{loadingMatch ? '🤖 Matching...' : '🤖 Match My Jobs'}</span>
                    </button>
                  </div>
                ) : (
                  matches.map((match, index) => (
                    <div key={index} className='card' style={{ border: '1px solid rgba(0,212,170,0.2)', position: 'relative' }}>
                      <div style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        background: 'linear-gradient(135deg, #00d4aa, #6c63ff)',
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontWeight: '700',
                        fontSize: '13px'
                      }}>
                        {match.matchScore}% Match
                      </div>
                      <h3 style={{ fontSize: '17px', fontWeight: '700', marginBottom: '6px', paddingRight: '100px' }}>
                        {match.job?.title}
                      </h3>
                      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', marginBottom: '10px' }}>
                        🏢 {match.job?.companyName} &nbsp;|&nbsp; 📍 {match.job?.location}
                      </p>
                      <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', lineHeight: '1.7', marginBottom: '12px' }}>
                        {match.job?.description}
                      </p>
                      <div style={{
                        background: 'rgba(0,212,170,0.06)',
                        border: '1px solid rgba(0,212,170,0.15)',
                        padding: '12px',
                        borderRadius: '10px',
                        marginBottom: '16px'
                      }}>
                        <p style={{ color: '#00d4aa', fontSize: '13px' }}>
                          🤖 <strong>AI says:</strong> {match.matchReason}
                        </p>
                      </div>
                      {match.job?.employer?._id === user?._id || match.job?.employer === user?._id ? (
                        <span style={{
                          padding: '8px 16px',
                          borderRadius: '8px',
                          background: 'rgba(255,255,255,0.06)',
                          color: 'rgba(255,255,255,0.3)',
                          fontSize: '13px'
                        }}>
                          Your own job posting
                        </span>
                      ) : (
                        <button
                          className='btn btn-primary'
                          onClick={() => handleApply(match.job?._id)}
                          disabled={applying === match.job?._id || applications.some(a => a.job?._id === match.job?._id || a.job === match.job?._id)}
                          style={{ padding: '8px 20px' }}
                        >
                          <span>
                            {applying === match.job?._id ? 'Applying...' :
                              applications.some(a => a.job?._id === match.job?._id || a.job === match.job?._id)
                                ? '✅ Applied' : 'Apply Now'}
                          </span>
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* ===== MY APPLICATIONS TAB (Graduate) ===== */}
            {activeTab === 'myapplications' && user?.activeRole === 'graduate' && (
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>My Applications</h3>
                {applications.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '48px' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
                    <p style={{ color: 'rgba(255,255,255,0.4)' }}>You have not applied for any jobs yet</p>
                  </div>
                ) : (
                  applications.map((app, index) => (
                    <div key={index} className='card'>
                      <h3 style={{ fontSize: '17px', fontWeight: '700', marginBottom: '6px' }}>
                        {app.job?.title}
                      </h3>
                      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', marginBottom: '6px' }}>
                        🏢 {app.job?.companyName} &nbsp;|&nbsp; 📍 {app.job?.location}
                      </p>
                      <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px', marginBottom: '16px' }}>
                        📅 Applied: {new Date(app.createdAt).toLocaleDateString()}
                      </p>
                      <span className={`status-${app.status}`}>
                        {app.status?.toUpperCase()}
                      </span>
                      {app.status === 'accepted' && (
                        <div style={{
                          marginTop: '16px',
                          background: 'rgba(0,212,170,0.08)',
                          border: '1px solid rgba(0,212,170,0.2)',
                          padding: '16px',
                          borderRadius: '12px'
                        }}>
                          <p style={{ color: '#00d4aa', fontSize: '14px', marginBottom: '12px' }}>
                            🎉 Congratulations! You have been accepted. Message the employer now!
                          </p>
                          <button
                            className='btn btn-primary'
                            onClick={() => navigate('/messages')}
                            style={{ padding: '8px 20px', fontSize: '13px' }}
                          >
                            <span>💬 Message Employer</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* ===== POST JOB TAB (Employer) ===== */}
            {activeTab === 'postjob' && user?.activeRole === 'employer' && (
              <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>Post a New Job</h3>
                <form onSubmit={handlePostJob}>
                  <div className='form-group'>
                    <label>Job Title</label>
                    <input type='text' placeholder='e.g. Software Developer' value={jobForm.title} onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })} required />
                  </div>
                  <div className='form-group'>
                    <label>Job Description</label>
                    <textarea placeholder='Describe the role and responsibilities' value={jobForm.description} onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })} rows='4' required />
                  </div>
                  <div className='form-group'>
                    <label>Requirements (comma separated)</label>
                    <input type='text' placeholder='e.g. Python, 2 years experience' value={jobForm.requirements} onChange={(e) => setJobForm({ ...jobForm, requirements: e.target.value })} />
                  </div>
                  <div className='form-group'>
                    <label>Location</label>
                    <input type='text' placeholder='e.g. Minna, Niger State' value={jobForm.location} onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })} />
                  </div>
                  <div className='form-group'>
                    <label>Salary (optional)</label>
                    <input type='text' placeholder='e.g. ₦150,000/month' value={jobForm.salary} onChange={(e) => setJobForm({ ...jobForm, salary: e.target.value })} />
                  </div>
                  <div className='form-group'>
                    <label>Job Type</label>
                    <select value={jobForm.jobType} onChange={(e) => setJobForm({ ...jobForm, jobType: e.target.value })}>
                      <option value='full-time'>Full Time</option>
                      <option value='part-time'>Part Time</option>
                      <option value='internship'>Internship</option>
                      <option value='contract'>Contract</option>
                    </select>
                  </div>
                  <button type='submit' className='btn btn-primary' style={{ width: '100%', padding: '14px', fontSize: '15px' }}>
                    <span>Post Job →</span>
                  </button>
                </form>
              </div>
            )}

            {/* ===== MY JOBS TAB (Employer) ===== */}
            {activeTab === 'myjobs' && user?.activeRole === 'employer' && (
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>My Posted Jobs</h3>
                {myJobs.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '48px' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>💼</div>
                    <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '20px' }}>No jobs posted yet</p>
                    <button className='btn btn-primary' onClick={() => setActiveTab('postjob')}>
                      <span>Post Your First Job →</span>
                    </button>
                  </div>
                ) : (
                  myJobs.map((job) => (
                    <div key={job._id} className='card'>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '12px' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                            <h3 style={{ fontSize: '17px', fontWeight: '700' }}>{job.title}</h3>
                            <span style={{
                              padding: '3px 10px',
                              borderRadius: '6px',
                              fontSize: '12px',
                              fontWeight: '600',
                              background: job.status === 'open' ? 'rgba(0,212,170,0.1)' : 'rgba(255,71,87,0.1)',
                              color: job.status === 'open' ? '#00d4aa' : '#ff4757',
                              border: job.status === 'open' ? '1px solid rgba(0,212,170,0.2)' : '1px solid rgba(255,71,87,0.2)'
                            }}>
                              {job.status === 'open' ? '🟢 Open' : '🔴 Closed'}
                            </span>
                          </div>
                          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', marginBottom: '8px' }}>
                            📍 {job.location} &nbsp;|&nbsp; 💼 {job.jobType}
                            {job.salary && <>&nbsp;|&nbsp; 💰 {job.salary}</>}
                          </p>
                          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', lineHeight: '1.7' }}>
                            {job.description}
                          </p>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <button
                            className='btn btn-primary'
                            onClick={() => handleJobStatus(job._id, job.status === 'open' ? 'closed' : 'open')}
                            style={{ padding: '8px 16px', fontSize: '13px' }}
                          >
                            <span>{job.status === 'open' ? '🔒 Close' : '🔓 Reopen'}</span>
                          </button>
                          <button
                            className='btn btn-danger'
                            onClick={() => handleDeleteJob(job._id)}
                            style={{ padding: '8px 16px', fontSize: '13px' }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* ===== APPLICATIONS TAB (Employer) ===== */}
            {activeTab === 'applications' && user?.activeRole === 'employer' && (
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>Job Applications</h3>
                {employerApplications.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '48px' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
                    <p style={{ color: 'rgba(255,255,255,0.4)' }}>No applications yet</p>
                  </div>
                ) : (
                  employerApplications.map((app, index) => (
                    <div key={index} className='card'>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '12px' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                            <div style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '50%',
                              background: 'linear-gradient(135deg, #00d4aa, #6c63ff)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 'bold',
                              fontSize: '16px',
                              flexShrink: 0
                            }}>
                              {app.graduate?.name?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h3 style={{ fontSize: '16px', fontWeight: '700' }}>{app.graduate?.name}</h3>
                              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>{app.graduate?.email}</p>
                            </div>
                          </div>
                          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', marginBottom: '6px' }}>
                            🎓 {app.graduate?.department} | Class of {app.graduate?.graduationYear}
                          </p>
                          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', marginBottom: '12px' }}>
                            💼 Applied for: <strong style={{ color: 'white' }}>{app.job?.title}</strong>
                          </p>
                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                            {app.graduate?.skills?.map((skill, i) => (
                              <span key={i} className='tag'>{skill}</span>
                            ))}
                          </div>
                          <span className={`status-${app.status}`}>
                            {app.status?.toUpperCase()}
                          </span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <button
                            className='btn btn-primary'
                            onClick={() => updateApplicationStatus(app._id, { status: 'accepted' }).then(fetchEmployerApplications)}
                            style={{ padding: '8px 16px', fontSize: '13px' }}
                          >
                            <span>Accept</span>
                          </button>
                          <button
                            className='btn btn-danger'
                            onClick={() => updateApplicationStatus(app._id, { status: 'rejected' }).then(fetchEmployerApplications)}
                            style={{ padding: '8px 16px', fontSize: '13px' }}
                          >
                            Reject
                          </button>
                          {app.status === 'accepted' && (
                            <button
                              className='btn btn-secondary'
                              onClick={() => navigate('/messages', { state: { selectedUser: app.graduate } })}
                              style={{ padding: '8px 16px', fontSize: '13px' }}
                            >
                              💬 Message
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* ===== MESSAGES TAB (Alumni) ===== */}
            {activeTab === 'messages' && user?.activeRole === 'alumni' && (
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>Your Conversations</h3>
                {conversations.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '48px' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>💬</div>
                    <p style={{ color: 'rgba(255,255,255,0.4)' }}>
                      No messages yet. Graduates will reach out to you for mentorship!
                    </p>
                  </div>
                ) : (
                  conversations.map((conv, index) => (
                    <div
                      key={index}
                      className='card'
                      style={{ cursor: 'pointer' }}
                      onClick={() => navigate('/messages', { state: { selectedUser: conv.user } })}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{
                          width: '50px',
                          height: '50px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #00d4aa, #6c63ff)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 'bold',
                          fontSize: '20px',
                          flexShrink: 0
                        }}>
                          {conv.user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '4px' }}>
                            {conv.user?.name}
                          </h4>
                          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', marginBottom: '4px' }}>
                            {conv.user?.role}
                          </p>
                          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>
                            {conv.lastMessage}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;