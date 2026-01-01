const fs = require('fs');
const pdf = require('pdf-extraction');
const { CohereClient } = require('cohere-ai');
require('dotenv').config(); 

// --- DEBUG CHECK ---
if (!process.env.COHERE_API_KEY) {
    console.error("❌ ERROR: COHERE_API_KEY is missing in .env file");
}

// Initialize Cohere
const cohere = new CohereClient({
    token: process.env.COHERE_API_KEY,
});

// --- UPLOAD RESUME CONTROLLER (Cohere Fixed Version) ---
exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // 1. Read PDF & Extract Text
    const dataBuffer = fs.readFileSync(req.file.path);
    const data = await pdf(dataBuffer);
    const extractedText = data.text; 

    // 2. Ask Cohere to Analyze
    // ✅ FIXED: Using the specific versioned model name
    const response = await cohere.chat({
        model: 'command-r-08-2024', // Updated Model Name
        message: `
            You are an expert AI Career Architect. Analyze the following resume text:
            "${extractedText.slice(0, 10000)}"

            Based on the candidate's skills, pretend they are applying for their absolute best-fit role.
            
            Provide a structured response in valid JSON format with exactly these 3 sections:
            
            1. "eligibility": {
                "status": "Yes" or "No", 
                "roles": ["List of 2-3 specific job titles they fit best"],
                "reason": "A 2-sentence professional explanation of why they fit these roles."
            }
            
            2. "roadmap": [
                "Step 1: [Actionable Step]",
                "Step 2: [Actionable Step]",
                "Step 3: [Actionable Step]",
                "Step 4: [Actionable Step]"
            ] (Provide exactly 4 high-value steps)

            3. "suggestions": {
                "certifications": ["List 2 specific real-world certifications"],
                "technicalSkills": ["List 3-5 specific modern tools they are missing"]
            }

            IMPORTANT: Return ONLY the JSON object. Do not add markdown formatting like \`\`\`json.
        `,
        temperature: 0.3, 
    });

    let aiText = response.text;
    
    // Clean Response
    aiText = aiText.replace(/```json/g, "").replace(/```/g, "").trim();
    
    let analysisResult;
    try {
        analysisResult = JSON.parse(aiText);
    } catch (e) {
        console.error("AI Parse Error:", e);
        // Fallback to raw text if JSON parsing fails
        return res.status(500).json({ message: "Failed to parse AI response" });
    }

    // Cleanup
    fs.unlinkSync(req.file.path);

    res.json({ 
      message: "Scan Successful", 
      analysis: analysisResult 
    });

  } catch (error) {
    console.error("Cohere Error:", error);
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({ message: "Server Error analyzing PDF" });
  }
};

// Placeholder for manual route
exports.analyzeProfile = async (req, res) => {
    res.json({ message: "Manual analysis handled by route" }); 
};