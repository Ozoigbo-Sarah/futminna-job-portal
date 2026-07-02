const Application = require('../models/Application');
const Job = require('../models/Job');

// Apply for a job
exports.applyForJob = async (req, res) => {
  try {
    const { jobId, coverLetter } = req.body;

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      graduate: req.user.id
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    const application = new Application({
      job: jobId,
      graduate: req.user.id,
      coverLetter: coverLetter || ''
    });

    await application.save();
    res.status(201).json({ message: 'Application submitted successfully!', application });
  } catch (error) {
    console.log('APPLICATION ERROR:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all applications for a graduate
exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ graduate: req.user.id })
      .populate('job')
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all applications for an employer's jobs
exports.getJobApplications = async (req, res) => {
  try {
    const jobs = await Job.find({ employer: req.user.id });
    const jobIds = jobs.map(job => job._id);

    const applications = await Application.find({ job: { $in: jobIds } })
      .populate('graduate', 'name email skills department graduationYear resumeText')
      .populate('job', 'title')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update application status (employer only)
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    res.json({ message: 'Application status updated!', application });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};