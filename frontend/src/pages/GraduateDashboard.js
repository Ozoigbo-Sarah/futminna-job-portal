import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { matchJobs, getAllJobs, uploadResume, applyForJob, getMyApplications } from '../utils/api';

const GraduateDashboard = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [loadingMatch, setLoadingMatch] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [uploading, setUploading] = useState(false);
  const [resumeData, setResumeData] = useState(null);
  const [applications, setApplications] = useState([]);
  const [applying, setApplying] = useState(null);

  useEffect(() => {
    fetchJobs();
    fetchApplications();
  }, []);

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
  
  const fetchApplications = async () => {
    try {
      const res = await getMyApplications();
      setApplications(res.data);
    } catch (error) {
      console.log('Failed to fetch applications');
    }
  };

  const handleApply = async (jobId) => {
    setApplying(jobId);
    try {
      await applyForJob({ jobId });
      toast.success('Application submitted successfully!');
      fetchApplications();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Application failed');
    }
    setApplying(null);
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

  const tabStyle = (tab) => ({
    padding: '10px 20px',
    border: 'none',
    borderBottom: activeTab === tab ? '3px solid #008751' : '3px solid transparent',
    backgroundColor: 'transparent',
    color: activeTab === tab ? '#008751' : '#666',
    fontWeight: activeTab === tab ? 'bold' : 'normal',
    fontSize: '15px',
    cursor: 'pointer'
  });

  return (
    <div className='page'>
      <div className='container'>
        {/* Header */}
        <div className='card' style={{
          background: 'linear-gradient(135deg, #008751 0%, #005a35 100%)',
          color: 'white'
        }}>
          <h1 style={{ fontSize: '26px', marginBottom: '5px' }}>
            Welcome, {user?.name}! 👋
          </h1>
          <p style={{ opacity: '0.9' }}>
            {user?.department} | Class of {user?.graduationYear}
          </p>
          <div style={{ marginTop: '15px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {user?.skills?.map((skill, index) => (
              <span key={index} style={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '13px'
              }}>
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className='card' style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid #eee' }}>
            <button style={tabStyle('overview')} onClick={() => setActiveTab('overview')}>
              Overview
            </button>
            <button style={tabStyle('jobs')} onClick={() => setActiveTab('jobs')}>
              All Jobs ({jobs.length})
            </button>
           <button style={tabStyle('matches')} onClick={() => setActiveTab('matches')}>
              AI Matches ({matches.length})
            </button>
            <button style={tabStyle('myapplications')} onClick={() => setActiveTab('myapplications')}>
              My Applications ({applications.length})
            </button>
          </div>

          <div style={{ padding: '20px' }}>
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '20px',
                  marginBottom: '30px'
                }}>
                  <div style={{
                    backgroundColor: '#f0f9f4',
                    padding: '20px',
                    borderRadius: '10px',
                    textAlign: 'center'
                  }}>
                    <h2 style={{ color: '#008751', fontSize: '36px' }}>{jobs.length}</h2>
                    <p style={{ color: '#666' }}>Available Jobs</p>
                  </div>
                  <div style={{
                    backgroundColor: '#f0f9f4',
                    padding: '20px',
                    borderRadius: '10px',
                    textAlign: 'center'
                  }}>
                    <h2 style={{ color: '#008751', fontSize: '36px' }}>{user?.skills?.length || 0}</h2>
                    <p style={{ color: '#666' }}>Your Skills</p>
                  </div>
                  <div style={{
                    backgroundColor: '#f0f9f4',
                    padding: '20px',
                    borderRadius: '10px',
                    textAlign: 'center'
                  }}>
                    <h2 style={{ color: '#008751', fontSize: '36px' }}>{matches.length}</h2>
                    <p style={{ color: '#666' }}>AI Matches</p>
                  </div>
                </div>
             {/* Resume Upload */}
                <div className='card' style={{ border: '2px dashed #008751', textAlign: 'center', padding: '30px' }}>
                  <h3 style={{ marginBottom: '10px', color: '#333' }}>
                    📄 Upload Your Resume
                  </h3>
                  <p style={{ color: '#666', marginBottom: '20px' }}>
                    Upload your PDF resume and our AI will automatically extract your skills
                  </p>
                  <label style={{
                    backgroundColor: '#008751',
                    color: 'white',
                    padding: '12px 30px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}>
                    {uploading ? '⏳ Analyzing resume...' : '📤 Upload Resume (PDF)'}
                    <input
                      type='file'
                      accept='.pdf'
                      onChange={handleResumeUpload}
                      style={{ display: 'none' }}
                      disabled={uploading}
                    />
                  </label>

                  {/* Show extracted data */}
                  {resumeData && (
                    <div style={{ marginTop: '20px', textAlign: 'left' }}>
                      <h4 style={{ color: '#008751', marginBottom: '10px' }}>
                        ✅ AI Extracted from your Resume:
                      </h4>
                      <div style={{ marginBottom: '10px' }}>
                        <strong>Skills:</strong>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '5px' }}>
                          {resumeData.skills?.map((skill, i) => (
                            <span key={i} style={{
                              backgroundColor: '#f0f9f4',
                              color: '#008751',
                              padding: '3px 10px',
                              borderRadius: '20px',
                              fontSize: '13px'
                            }}>
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      <p><strong>Education:</strong> {resumeData.education}</p>
                      <p><strong>Experience:</strong> {resumeData.experience}</p>
                    </div>
                  )}
                </div>

                {/* AI Match Button */}
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <h3 style={{ marginBottom: '10px', color: '#333' }}>
                    Ready to find your perfect job?
                  </h3>
                  <p style={{ color: '#666', marginBottom: '20px' }}>
                    Our AI will analyze your skills and match you with the best jobs
                  </p>
                  <button
                    className='btn btn-primary'
                    onClick={handleMatchJobs}
                    disabled={loadingMatch}
                    style={{ padding: '12px 30px', fontSize: '16px' }}
                  >
                    {loadingMatch ? '🤖 AI is matching your jobs...' : '🤖 Match My Jobs with AI'}
                  </button>
                </div>
              </div>
            )}

            {/* All Jobs Tab */}
            {activeTab === 'jobs' && (
              <div>
                <h3 style={{ marginBottom: '20px', color: '#333' }}>All Available Jobs</h3>
                {loadingJobs ? (
                  <p>Loading jobs...</p>
                ) : jobs.length === 0 ? (
                  <p style={{ color: '#666', textAlign: 'center' }}>No jobs available yet</p>
                ) : (
                  jobs.map((job) => (
                    <div key={job._id} className='card' style={{ border: '1px solid #eee' }}>
                      <h3 style={{ color: '#008751', marginBottom: '5px' }}>{job.title}</h3>
                      <p style={{ color: '#666', fontSize: '14px', marginBottom: '10px' }}>
                        🏢 {job.companyName} | 📍 {job.location} | 💼 {job.jobType}
                      </p>
                      <p style={{ color: '#444', marginBottom: '10px' }}>{job.description}</p>
                      {job.salary && (
                        <p style={{ color: '#008751', fontWeight: 'bold' }}>💰 {job.salary}</p>
                      )}
                      <div style={{ marginTop: '10px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {job.requirements?.map((req, i) => (
                          <span key={i} style={{
                            backgroundColor: '#f0f9f4',
                            color: '#008751',
                            padding: '3px 10px',
                            borderRadius: '20px',
                            fontSize: '13px'
                          }}>
                            {req}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* AI Matches Tab */}
            {activeTab === 'matches' && (
              <div>
                <h3 style={{ marginBottom: '20px', color: '#333' }}>Your AI Matched Jobs</h3>
                {matches.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '30px' }}>
                    <p style={{ color: '#666', marginBottom: '20px' }}>
                      No matches yet. Click the button below to let AI find your best jobs!
                    </p>
                    <button
                      className='btn btn-primary'
                      onClick={handleMatchJobs}
                      disabled={loadingMatch}
                    >
                      {loadingMatch ? '🤖 Matching...' : '🤖 Match My Jobs'}
                    </button>
                  </div>
                ) : (
                  matches.map((match, index) => (
                    <div key={index} className='card' style={{
                      border: '2px solid #008751',
                      position: 'relative'
                    }}>
                      <div style={{
                        position: 'absolute',
                        top: '15px',
                        right: '15px',
                        backgroundColor: '#008751',
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontWeight: 'bold',
                        fontSize: '14px'
                      }}>
                        {match.matchScore}% Match
                      </div>
                      <h3 style={{ color: '#008751', marginBottom: '5px' }}>
                        {match.job?.title}
                      </h3>
                      <p style={{ color: '#666', fontSize: '14px', marginBottom: '10px' }}>
                        🏢 {match.job?.companyName} | 📍 {match.job?.location}
                      </p>
                      <p style={{ color: '#444', marginBottom: '10px' }}>
                        {match.job?.description}
                      </p>
                      <div style={{
                        backgroundColor: '#f0f9f4',
                        padding: '10px',
                        borderRadius: '5px',
                        marginTop: '10px'
                      }}>
                        <p style={{ color: '#008751', fontSize: '14px' }}>
                          🤖 <strong>AI says:</strong> {match.matchReason}
                        </p>
                      </div>
                      <div style={{ marginTop: '15px' }}>
                        <button
                          className='btn btn-primary'
                          onClick={() => handleApply(match.job?._id)}
                          disabled={applying === match.job?._id || applications.some(a => a.job?._id === match.job?._id || a.job === match.job?._id)}
                          style={{ padding: '8px 20px' }}
                        >
                          {applying === match.job?._id ? 'Applying...' :
                            applications.some(a => a.job?._id === match.job?._id || a.job === match.job?._id)
                              ? '✅ Applied' : 'Apply Now'}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          {/* My Applications Tab */}
            {activeTab === 'myapplications' && (
              <div>
                <h3 style={{ marginBottom: '20px', color: '#333' }}>My Applications</h3>
                {applications.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '30px' }}>
                    <p style={{ color: '#666' }}>You have not applied for any jobs yet</p>
                  </div>
                ) : (
                  applications.map((app, index) => (
                    <div key={index} className='card' style={{ border: '1px solid #eee' }}>
                      <h3 style={{ color: '#008751', marginBottom: '5px' }}>
                        {app.job?.title}
                      </h3>
                      <p style={{ color: '#666', fontSize: '14px', marginBottom: '5px' }}>
                        🏢 {app.job?.companyName} | 📍 {app.job?.location}
                      </p>
                      <p style={{ color: '#666', fontSize: '14px', marginBottom: '10px' }}>
                        📅 Applied on: {new Date(app.createdAt).toLocaleDateString()}
                      </p>
                      <span style={{
                        backgroundColor: app.status === 'pending' ? '#fff3cd' :
                          app.status === 'accepted' ? '#d4edda' :
                          app.status === 'rejected' ? '#f8d7da' : '#d1ecf1',
                        color: app.status === 'pending' ? '#856404' :
                          app.status === 'accepted' ? '#155724' :
                          app.status === 'rejected' ? '#721c24' : '#0c5460',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '13px',
                        fontWeight: 'bold'
                      }}>
                        {app.status?.toUpperCase()}
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}
          {/* My Applications Tab */}
            {activeTab === 'myapplications' && (
              <div>
                <h3 style={{ marginBottom: '20px', color: '#333' }}>My Applications</h3>
                {applications.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '30px' }}>
                    <p style={{ color: '#666' }}>You have not applied for any jobs yet</p>
                  </div>
                ) : (
                  applications.map((app, index) => (
                    <div key={index} className='card' style={{ border: '1px solid #eee' }}>
                      <h3 style={{ color: '#008751', marginBottom: '5px' }}>
                        {app.job?.title}
                      </h3>
                      <p style={{ color: '#666', fontSize: '14px', marginBottom: '5px' }}>
                        🏢 {app.job?.companyName} | 📍 {app.job?.location}
                      </p>
                      <p style={{ color: '#666', fontSize: '14px', marginBottom: '10px' }}>
                        📅 Applied on: {new Date(app.createdAt).toLocaleDateString()}
                      </p>
                      <span style={{
                        backgroundColor: app.status === 'pending' ? '#fff3cd' :
                          app.status === 'accepted' ? '#d4edda' :
                          app.status === 'rejected' ? '#f8d7da' : '#d1ecf1',
                        color: app.status === 'pending' ? '#856404' :
                          app.status === 'accepted' ? '#155724' :
                          app.status === 'rejected' ? '#721c24' : '#0c5460',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '13px',
                        fontWeight: 'bold'
                      }}>
                        {app.status?.toUpperCase()}
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}
         

{/* My Applications Tab */}
            {activeTab === 'myapplications' && (
              <div>
                <h3 style={{ marginBottom: '20px', color: '#333' }}>My Applications</h3>
                {applications.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '30px' }}>
                    <p style={{ color: '#666' }}>You have not applied for any jobs yet</p>
                  </div>
                ) : (
                  applications.map((app, index) => (
                    <div key={index} className='card' style={{ border: '1px solid #eee' }}>
                      <h3 style={{ color: '#008751', marginBottom: '5px' }}>
                        {app.job?.title}
                      </h3>
                      <p style={{ color: '#666', fontSize: '14px', marginBottom: '5px' }}>
                        🏢 {app.job?.companyName} | 📍 {app.job?.location}
                      </p>
                      <p style={{ color: '#666', fontSize: '14px', marginBottom: '10px' }}>
                        📅 Applied on: {new Date(app.createdAt).toLocaleDateString()}
                      </p>
                      <span style={{
                        backgroundColor: app.status === 'pending' ? '#fff3cd' :
                          app.status === 'accepted' ? '#d4edda' :
                          app.status === 'rejected' ? '#f8d7da' : '#d1ecf1',
                        color: app.status === 'pending' ? '#856404' :
                          app.status === 'accepted' ? '#155724' :
                          app.status === 'rejected' ? '#721c24' : '#0c5460',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '13px',
                        fontWeight: 'bold'
                      }}>
                        {app.status?.toUpperCase()}
                      </span>
                      {app.status === 'accepted' && (
                        <div style={{
                          marginTop: '10px',
                          backgroundColor: '#d4edda',
                          padding: '10px 15px',
                          borderRadius: '5px',
                          border: '1px solid #c3e6cb'
                        }}>
                          <p style={{ color: '#155724', fontSize: '14px', marginBottom: '8px' }}>
                            🎉 Congratulations! You have been accepted for this position.
                            You can now message the employer directly.
                          </p>
                          <button
                            className='btn btn-primary'
                            onClick={() => window.location.href = '/messages'}
                            style={{ padding: '6px 14px', fontSize: '13px' }}
                          >
                            💬 Message Employer
                          </button>
                        </div>
                      )}
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
export default GraduateDashboard;