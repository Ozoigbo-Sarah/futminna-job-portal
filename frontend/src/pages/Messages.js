import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { getAlumni, getMessages, sendMessage, getConversations } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';

const Messages = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [alumni, setAlumni] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchData();
    if (location.state?.selectedUser) {
      setSelectedUser(location.state.selectedUser);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedUser) {
      fetchMessages(selectedUser._id);
    }
  }, [selectedUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchData = async () => {
    try {
      const [alumniRes, convRes] = await Promise.all([
        getAlumni(),
        getConversations()
      ]);
      setAlumni(alumniRes.data);
      setConversations(convRes.data);
    } catch (error) {
      toast.error('Failed to fetch data');
    }
  };

  const fetchMessages = async (userId) => {
    setLoading(true);
    try {
      const res = await getMessages(userId);
      setMessages(res.data);
    } catch (error) {
      toast.error('Failed to fetch messages');
    }
    setLoading(false);
  };

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    try {
      await sendMessage({ receiverId: selectedUser._id, content: newMessage });
      setNewMessage('');
      fetchMessages(selectedUser._id);
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  const peopleToShow = user?.activeRole === 'graduate' ? alumni : conversations.map(c => c.user);

 

  return (
    <div style={{
      height: 'calc(100vh - 70px)',
      display: 'grid',
      gridTemplateColumns: window.innerWidth <= 768 ? '1fr' : '300px 1fr',
      gap: '0'
    }}>
      {/* Left Panel */}
      <div style={{
        borderRight: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
       {/* Panel Header */}
        <div style={{
          padding: '20px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(255,255,255,0.02)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '700' }}>
              {user?.activeRole === 'graduate' ? '🤝 Alumni Mentors' : '💬 Messages'}
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px', marginTop: '4px' }}>
              {peopleToShow.length} contacts
            </p>
          </div>
        </div>

        {/* People List */}
        <div style={{ overflowY: 'auto', flex: 1 }}>
          {peopleToShow.length === 0 ? (
            <div style={{ padding: '40px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>👥</div>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '14px' }}>
                No contacts yet
              </p>
            </div>
          ) : (
            peopleToShow.map((person, index) => (
              <div
                key={index}
                onClick={() => setSelectedUser(person)}
                style={{
                  padding: '16px 20px',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                  cursor: 'pointer',
                  backgroundColor: selectedUser?._id === person._id
                    ? 'rgba(0, 212, 170, 0.08)'
                    : 'transparent',
                  borderLeft: selectedUser?._id === person._id
                    ? '3px solid #00d4aa'
                    : '3px solid transparent',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => {
                  if (selectedUser?._id !== person._id) {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)';
                  }
                }}
                onMouseLeave={e => {
                  if (selectedUser?._id !== person._id) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #00d4aa, #6c63ff)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  flexShrink: 0
                }}>
                  {person?.name?.charAt(0).toUpperCase()}
                </div>
                <div style={{ overflow: 'hidden' }}>
                  <h4 style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: selectedUser?._id === person._id ? '#00d4aa' : 'white',
                    marginBottom: '2px'
                  }}>
                    {person?.name}
                  </h4>
                  <p style={{
                    color: 'rgba(255,255,255,0.3)',
                    fontSize: '12px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {person?.department} {person?.graduationYear && `| ${person.graduationYear}`}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Panel - Chat */}
      <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div style={{
              padding: '16px 24px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              background: 'rgba(255,255,255,0.02)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #00d4aa, #6c63ff)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '16px'
              }}>
                {selectedUser?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h4 style={{ fontSize: '15px', fontWeight: '700' }}>{selectedUser?.name}</h4>
                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>
                  {selectedUser?.department} {selectedUser?.graduationYear && `| Class of ${selectedUser.graduationYear}`}
                </p>
              </div>
              <div style={{
                marginLeft: 'auto',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#00d4aa',
                boxShadow: '0 0 8px #00d4aa'
              }} />
            </div>

            {/* Messages */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <div className='spinner' />
                </div>
              ) : messages.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px', color: 'rgba(255,255,255,0.3)' }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>👋</div>
                  <p>No messages yet. Say hello!</p>
                </div>
              ) : (
                messages.map((msg, index) => {
                  const isMe = msg.sender === user._id || msg.sender?._id === user._id;
                  return (
                    <div key={index} style={{
                      display: 'flex',
                      justifyContent: isMe ? 'flex-end' : 'flex-start',
                      animation: 'fadeInUp 0.3s ease forwards'
                    }}>
                      <div style={{
                        maxWidth: '65%',
                        padding: '12px 16px',
                        borderRadius: isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                        background: isMe
                          ? 'linear-gradient(135deg, #00d4aa, #6c63ff)'
                          : 'rgba(255,255,255,0.06)',
                        color: 'white',
                        fontSize: '14px',
                        lineHeight: '1.6',
                        border: isMe ? 'none' : '1px solid rgba(255,255,255,0.08)'
                      }}>
                        {msg.content}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div style={{
              padding: '16px 24px',
              borderTop: '1px solid rgba(255,255,255,0.06)',
              display: 'flex',
              gap: '12px',
              alignItems: 'center'
            }}>
              <input
                type='text'
                placeholder='Type a message...'
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                style={{
                  flex: 1,
                  padding: '12px 18px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '25px',
                  color: 'white',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.3s'
                }}
                onFocus={e => e.target.style.borderColor = '#00d4aa'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
              <button
                onClick={handleSend}
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #00d4aa, #6c63ff)',
                  border: 'none',
                  color: 'white',
                  fontSize: '18px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s',
                  flexShrink: 0
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                ➤
              </button>
            </div>
          </>
        ) : (
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            color: 'rgba(255,255,255,0.2)'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>💬</div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: 'rgba(255,255,255,0.4)' }}>
              Select a conversation
            </h3>
            <p style={{ fontSize: '14px' }}>
              Choose a contact from the left to start chatting
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;