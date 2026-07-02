const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  roles: {
    type: [String],
    enum: ['graduate', 'employer', 'alumni'],
    default: ['graduate']
  },
  activeRole: {
    type: String,
    enum: ['graduate', 'employer', 'alumni'],
    default: 'graduate'
  },
  // For graduates and alumni
  skills: [String],
  bio: {
    type: String,
    default: ''
  },
  resumeText: {
    type: String,
    default: ''
  },
  department: {
    type: String,
    default: ''
  },
  graduationYear: {
    type: String,
    default: ''
  },
  // For employers
  companyName: {
    type: String,
    default: ''
  },
  companyDescription: {
    type: String,
    default: ''
  },
  github: {
    type: String,
    default: ''
  },
  linkedin: {
    type: String,
    default: ''
  },
  portfolio: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);