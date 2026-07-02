const Job = require('../models/Job');
const User = require('../models/User');
const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Create a job (employer only)
exports.createJob = async (req, res) => {
  try {
    const { title, description, requirements, location, salary, jobType } = req.body;

    const employer = await User.findById(req.user.id);

    const job = new Job({
      title,
      description,
      requirements: requirements || [],
      location,
      salary,
      jobType,
      employer: req.user.id,
      companyName: employer.companyName
    });

    await job.save();
    res.status(201).json({ message: 'Job created successfully', job });
  } catch (error) {
    console.log('MATCH ERROR FULL:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all jobs
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate('employer', 'name companyName').sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single job
exports.getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('employer', 'name companyName');
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// AI Job Matching
exports.matchJobs = async (req, res) => {
  try {
    const graduate = await User.findById(req.user.id);
    const jobs = await Job.find();

    if (jobs.length === 0) {
      return res.status(404).json({ message: 'No jobs available for matching' });
    }

    const jobList = jobs.map((job, index) => 
      `${index + 1}. Job ID: ${job._id}, Title: ${job.title}, Description: ${job.description}, Requirements: ${job.requirements.join(', ')}`
    ).join('\n');

    const prompt = `
      You are a job matching AI for FUT Minna graduates.
      
      Graduate Profile:
      - Name: ${graduate.name}
      - Skills: ${graduate.skills.join(', ')}
      - Department: ${graduate.department}
      - Resume: ${graduate.resumeText || 'Not provided'}
      
      Available Jobs:
      ${jobList}
      
      Please analyze the graduate's skills and match them with the most suitable jobs.
      Return a JSON array of the top matches in this exact format:
      [
        {
          "jobId": "job_id_here",
          "matchScore": 85,
          "matchReason": "Your skills in X match well with this job requirement for Y"
        }
      ]
      Return only the JSON array, nothing else.
    `;

   const result = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
    model: 'llama-3.3-70b-versatile',
    });
    const response = result.choices[0]?.message?.content || '';

    const cleanResponse = response.replace(/```json|```/g, '').trim();
    const matches = JSON.parse(cleanResponse);

    const matchedJobs = matches.map(match => {
      const job = jobs.find(j => j._id.toString() === match.jobId);
      return {
        job,
        matchScore: match.matchScore,
        matchReason: match.matchReason
      };
    }).filter(m => m.job);

    res.json({ matches: matchedJobs });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
// Close/Open a job
exports.updateJobStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.employer.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    job.status = status;
    await job.save();
    res.json({ message: `Job ${status} successfully`, job });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
// Delete job
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.employer.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    await job.deleteOne();
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};