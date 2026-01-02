const express = require('express');
const router = express.Router();
const multer = require('multer');
const { CohereClient } = require('cohere-ai'); 
const dotenv = require('dotenv');

// Import the Upload Controller
const { uploadResume } = require('../controllers/aiController'); 

dotenv.config();

// Initialize Cohere
const cohere = new CohereClient({
    token: process.env.COHERE_API_KEY,
});

const upload = multer({ dest: 'uploads/' });

// =========================================================
// ROUTE 1: MANUAL ANALYSIS (Cohere Fixed Version)
// =========================================================
router.post('/analyze-profile', async (req, res) => {
  const { education, skills, interests } = req.body;

  try {
    // ✅ FIXED: Using 'command-r-plus-08-2024'
    const response = await cohere.chat({
        model: 'command-r-plus',
        message: `
            You are a strict and professional Career Architect.
            Analyze this student profile:
            - Education History: ${education}
            - Current Skills: ${skills}
            - Job Interests: ${interests}

            Based on this, provide a response in valid JSON format with exactly these 3 sections:
            
            1. "eligibility": {
                "status": "Yes" or "No", 
                "roles": ["List of 2-3 specific job roles they fit"],
                "reason": "Short explanation (2 sentences) of fit."
            }

            2. "roadmap": [
                "Step 1: ...", "Step 2: ...", "Step 3: ...", "Step 4: ..."
            ] (4 concrete steps)

            3. "suggestions": {
                "certifications": ["List 2 specific courses"],
                "technicalSkills": ["List 3-5 specific technical skills to learn next"]
            }

            IMPORTANT: Return ONLY the JSON object. Do not add markdown formatting.
        `,
        temperature: 0.3,
    });

    let aiText = response.text;
    aiText = aiText.replace(/```json/g, "").replace(/```/g, "").trim();

    console.log("Cohere Response:", aiText); 

    res.json({ analysis: aiText });

  } catch (error) {
    console.error("Cohere API Error:", error);
    res.status(500).json({ message: 'AI Brain is tired. Try again later.' });
  }
});

router.post('/upload-resume', upload.single('resume'), uploadResume);

module.exports = router;