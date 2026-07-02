import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// Automatically attach token to every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Auth routes
export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');
export const switchRole = (data) => API.post('/auth/switch-role', data);
export const addRole = (data) => API.post('/auth/add-role', data);

// Job routes
export const getAllJobs = () => API.get('/jobs');
export const getJob = (id) => API.get(`/jobs/${id}`);
export const createJob = (data) => API.post('/jobs', data);
export const matchJobs = () => API.get('/jobs/match/me');
export const deleteJob = (id) => API.delete(`/jobs/${id}`);
export const updateJobStatus = (id, data) => API.patch(`/jobs/${id}/status`, data);

// Message routes
export const getAlumni = () => API.get('/messages/alumni');
export const getConversations = () => API.get('/messages/conversations');
export const getMessages = (userId) => API.get(`/messages/${userId}`);
export const sendMessage = (data) => API.post('/messages', data);
export const getUnreadCount = () => API.get('/messages/unread/count');

// Upload routes
export const uploadResume = (formData) => API.post('/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

// Application routes
export const applyForJob = (data) => API.post('/applications', data);
export const getMyApplications = () => API.get('/applications/my');
export const getJobApplications = () => API.get('/applications/employer');
export const updateApplicationStatus = (id, data) => API.patch(`/applications/${id}`, data);