const express = require('express');
const router = express.Router();
const { createJob, getAllJobs, getJob, matchJobs, deleteJob, updateJobStatus } = require('../controllers/jobController');
const auth = require('../middleware/auth');

// Get all jobs
router.get('/', getAllJobs);

// AI job matching (graduate only) - must be before /:id
router.get('/match/me', auth, matchJobs);

// Get single job
router.get('/:id', getJob);

// Create a job (employer only)
router.post('/', auth, createJob);

// Update job status
router.patch('/:id/status', auth, updateJobStatus);

// Delete job
router.delete('/:id', auth, deleteJob);

module.exports = router;