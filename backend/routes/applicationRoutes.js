const express = require('express');
const router = express.Router();
const {
  applyForJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus
} = require('../controllers/applicationController');
const auth = require('../middleware/auth');

// Apply for a job (graduate only)
router.post('/', auth, applyForJob);

// Get my applications (graduate only)
router.get('/my', auth, getMyApplications);

// Get all applications for employer's jobs
router.get('/employer', auth, getJobApplications);

// Update application status (employer only)
router.patch('/:id', auth, updateApplicationStatus);

module.exports = router;