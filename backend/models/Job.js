const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  requirements: [String],
  location: {
    type: String,
    default: ''
  },
  salary: {
    type: String,
    default: ''
  },
  jobType: {
    type: String,
    enum: ['full-time', 'part-time', 'internship', 'contract'],
    default: 'full-time'
  },
  employer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  companyName: {
    type: String,
    default: ''
  },
  matchedCandidates: [
    {
      graduate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      matchScore: Number,
      matchReason: String
    }
  ],
  status: {
    type: String,
    enum: ['open', 'closed'],
    default: 'open'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Job', jobSchema);