import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { getConversations } from '../utils/api';
import { useNavigate } from 'react-router-dom';

const AlumniDashboard = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    setLoading(true);
    try {
      const res = await getConversations();
      setConversations(res.data);
    } catch (error) {
      toast.error('Failed to fetch conversations');
    }
    setLoading(false);
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
            {user?.department} | Class of {user?.graduationYear} — Alumni Mentor
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
            <button style={tabStyle('messages')} onClick={() => setActiveTab('messages')}>
              Messages ({conversations.length})
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
                    <h2 style={{ color: '#008751', fontSize: '36px' }}>{conversations.length}</h2>
                    <p style={{ color: '#666' }}>Active Conversations</p>
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
                </div>

                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <h3 style={{ marginBottom: '10px' }}>You are making a difference! 🌟</h3>
                  <p style={{ color: '#666', marginBottom: '20px' }}>
                    As an alumni mentor, you are helping FUT Minna graduates navigate their careers.
                    Check your messages to respond to graduates seeking guidance.
                  </p>
                  <button
                    className='btn btn-primary'
                    onClick={() => setActiveTab('messages')}
                    style={{ padding: '12px 30px', fontSize: '16px' }}
                  >
                    View Messages
                  </button>
                </div>
              </div>
            )}

            {/* Messages Tab */}
            {activeTab === 'messages' && (
              <div>
                <h3 style={{ marginBottom: '20px', color: '#333' }}>Your Conversations</h3>
                {loading ? (
                  <p>Loading conversations...</p>
                ) : conversations.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '30px' }}>
                    <p style={{ color: '#666' }}>
                      No messages yet. Graduates will reach out to you for mentorship!
                    </p>
                  </div>
                ) : (
                  conversations.map((conv, index) => (
                    <div
                      key={index}
                      className='card'
                      style={{
                        border: '1px solid #eee',
                        cursor: 'pointer',
                        transition: 'border-color 0.3s'
                      }}
                      onClick={() => navigate('/messages', { state: { selectedUser: conv.user } })}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{
                          width: '50px',
                          height: '50px',
                          borderRadius: '50%',
                          backgroundColor: '#008751',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '20px'
                        }}>
                          {conv.user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 style={{ color: '#333', marginBottom: '3px' }}>{conv.user?.name}</h4>
                          <p style={{ color: '#666', fontSize: '13px' }}>{conv.user?.role}</p>
                          <p style={{ color: '#888', fontSize: '13px', marginTop: '3px' }}>
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

export default AlumniDashboard;