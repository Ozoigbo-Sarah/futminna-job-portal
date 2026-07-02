const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadResume } = require('../controllers/uploadController');
const auth = require('../middleware/auth');

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Upload resume route
router.post('/', auth, upload.single('resume'), uploadResume);

module.exports = router;