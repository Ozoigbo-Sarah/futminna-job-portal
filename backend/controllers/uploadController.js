const User = require('../models/User');
const pdfParse = require('pdf-parse');
const Groq = require('groq-sdk');
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Extract text from PDF
    const pdfData = await pdfParse(req.file.buffer);
    const resumeText = pdfData.text;

    // Use Gemini AI to extract skills from resume
    const prompt = `
      You are a resume analyzer. Read this resume text and extract the following information.
      Return ONLY a JSON object in this exact format, nothing else:
      {
        "skills": ["skill1", "skill2", "skill3"],
        "education": "degree and institution",
        "experience": "years of experience and roles",
        "certifications": ["cert1", "cert2"]
      }
      
      Resume text:
      ${resumeText}
    `;

    const result = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
    });
    const response = result.choices[0]?.message?.content || '';
    const cleanResponse = response.replace(/```json|```/g, '').trim();
    const extractedData = JSON.parse(cleanResponse);

    // Update user profile with extracted information
    await User.findByIdAndUpdate(req.user.id, {
      resumeText: resumeText,
      skills: extractedData.skills || [],
    });

    res.json({
      message: 'Resume uploaded and analyzed successfully!',
      extractedData
    });
  } catch (error) {
    console.log('UPLOAD ERROR:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};