import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { createJob, getAllJobs, deleteJob, getJobApplications, updateApplicationStatus } from '../utils/api';
const EmployerDashboard = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [applications, setApplications] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    location: '',
    salary: '',
    jobType: 'full-time'
  });

  useEffect(() => {
    fetchJobs();
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await getJobApplications();
      setApplications(res.data);
    } catch (error) {
      console.log('Failed to fetch applications');
    }
  };

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await getAllJobs();
      const myJobs = res.data.filter(job => job.employer._id === user._id || job.employer === user._id);
      setJobs(myJobs);
    } catch (error) {
      toast.error('Failed to fetch jobs');
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const dataToSend = {
        ...formData,
        requirements: formData.requirements.split(',').map(r => r.trim()).filter(r => r)
      };
      await createJob(dataToSend);
      toast.success('Job posted successfully!');
      setFormData({
        title: '',
        description: '',
        requirements: '',
        location: '',
        salary: '',
        jobType: 'full-time'
      });
      fetchJobs();
      setActiveTab('myjobs');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to post job');
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await deleteJob(id);
        toast.success('Job deleted successfully!');
        fetchJobs();
      } catch (error) {
        toast.error('Failed to delete job');
      }
    }
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
            {user?.companyName} — Employer Dashboard
          </p>
        </div>

        {/* Tabs */}
        <div className='card' style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid #eee' }}>
            <button style={tabStyle('overview')} onClick={() => setActiveTab('overview')}>
              Overview
            </button>
            <button style={tabStyle('postjob')} onClick={() => setActiveTab('postjob')}>
              Post a Job
            </button>
            <button style={tabStyle('myjobs')} onClick={() => setActiveTab('myjobs')}>
              My Jobs ({jobs.length})
            </button>
            <button style={tabStyle('applications')} onClick={() => setActiveTab('applications')}>
              Applications ({applications.length})
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
                    <p style={{ color: '#666' }}>Jobs Posted</p>
                  </div>
                </div>
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <h3 style={{ marginBottom: '10px' }}>Ready to find the best candidates?</h3>
                  <p style={{ color: '#666', marginBottom: '20px' }}>
                    Post a job and our AI will match you with the best FUT Minna graduates
                  </p>
                  <button
                    className='btn btn-primary'
                    onClick={() => setActiveTab('postjob')}
                    style={{ padding: '12px 30px', fontSize: '16px' }}
                  >
                    Post a Job Now
                  </button>
                </div>
              </div>
            )}

            {/* Post Job Tab */}
            {activeTab === 'postjob' && (
              <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                <h3 style={{ marginBottom: '20px', color: '#333' }}>Post a New Job</h3>
                <form onSubmit={handleSubmit}>
                  <div className='form-group'>
                    <label>Job Title</label>
                    <input
                      type='text'
                      name='title'
                      placeholder='e.g. Software Developer'
                      value={formData.title}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className='form-group'>
                    <label>Job Description</label>
                    <textarea
                      name='description'
                      placeholder='Describe the job role and responsibilities'
                      value={formData.description}
                      onChange={handleChange}
                      rows='4'
                      required
                    />
                  </div>
                  <div className='form-group'>
                    <label>Requirements (comma separated)</label>
                    <input
                      type='text'
                      name='requirements'
                      placeholder='e.g. Python, 2 years experience, BSc Computer Science'
                      value={formData.requirements}
                      onChange={handleChange}
                    />
                  </div>
                  <div className='form-group'>
                    <label>Location</label>
                    <input
                      type='text'
                      name='location'
                      placeholder='e.g. Minna, Niger State'
                      value={formData.location}
                      onChange={handleChange}
                    />
                  </div>
                  <div className='form-group'>
                    <label>Salary (optional)</label>
                    <input
                      type='text'
                      name='salary'
                      placeholder='e.g. ₦150,000/month'
                      value={formData.salary}
                      onChange={handleChange}
                    />
                  </div>
                  <div className='form-group'>
                    <label>Job Type</label>
                    <select name='jobType' value={formData.jobType} onChange={handleChange}>
                      <option value='full-time'>Full Time</option>
                      <option value='part-time'>Part Time</option>
                      <option value='internship'>Internship</option>
                      <option value='contract'>Contract</option>
                    </select>
                  </div>
                  <button
                    type='submit'
                    className='btn btn-primary'
                    style={{ width: '100%', padding: '12px', fontSize: '16px' }}
                    disabled={loading}
                  >
                    {loading ? 'Posting...' : 'Post Job'}
                  </button>
                </form>
              </div>
            )}

            {/* My Jobs Tab */}
            {activeTab === 'myjobs' && (
              <div>
                <h3 style={{ marginBottom: '20px', color: '#333' }}>My Posted Jobs</h3>
                {jobs.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '30px' }}>
                    <p style={{ color: '#666', marginBottom: '20px' }}>
                      You have not posted any jobs yet
                    </p>
                    <button
                      className='btn btn-primary'
                      onClick={() => setActiveTab('postjob')}
                    >
                      Post Your First Job
                    </button>
                  </div>
                ) : (
                  jobs.map((job) => (
                    <div key={job._id} className='card' style={{ border: '1px solid #eee' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <div>
                          <h3 style={{ color: '#008751', marginBottom: '5px' }}>{job.title}</h3>
                          <p style={{ color: '#666', fontSize: '14px', marginBottom: '10px' }}>
                            📍 {job.location} | 💼 {job.jobType} | 💰 {job.salary}
                          </p>
                          <p style={{ color: '#444' }}>{job.description}</p>
                        </div>
                        <button
                          className='btn btn-danger'
                          onClick={() => handleDelete(job._id)}
                          style={{ padding: '6px 14px', fontSize: '13px', marginLeft: '10px' }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          {/* Applications Tab */}
            {activeTab === 'applications' && (
              <div>
                <h3 style={{ marginBottom: '20px', color: '#333' }}>Job Applications</h3>
                {applications.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '30px' }}>
                    <p style={{ color: '#666' }}>No applications yet</p>
                  </div>
                ) : (
                  applications.map((app, index) => (
                    <div key={index} className='card' style={{ border: '1px solid #eee' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <div>
                          <h3 style={{ color: '#008751', marginBottom: '5px' }}>
                            {app.graduate?.name}
                          </h3>
                          <p style={{ color: '#666', fontSize: '14px', marginBottom: '5px' }}>
                            📧 {app.graduate?.email}
                          </p>
                          <p style={{ color: '#666', fontSize: '14px', marginBottom: '5px' }}>
                            🎓 {app.graduate?.department} | Class of {app.graduate?.graduationYear}
                          </p>
                          <p style={{ color: '#666', fontSize: '14px', marginBottom: '10px' }}>
                            💼 Applied for: <strong>{app.job?.title}</strong>
                          </p>
                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
                            {app.graduate?.skills?.map((skill, i) => (
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
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <button
                            className='btn btn-primary'
                            onClick={() => updateApplicationStatus(app._id, { status: 'accepted' }).then(fetchApplications)}
                            style={{ padding: '6px 14px', fontSize: '13px' }}
                          >
                            Accept
                          </button>
                          <button
                            className='btn btn-danger'
                            onClick={() => updateApplicationStatus(app._id, { status: 'rejected' }).then(fetchApplications)}
                            style={{ padding: '6px 14px', fontSize: '13px' }}
                          >
                            Reject
                          </button>
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

export default EmployerDashboard;