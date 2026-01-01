const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes'); 
const aiRoutes = require('./routes/aiRoutes'); 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); 

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};
connectDB();

// --- REVIEW SCHEMA ---
const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  text: { type: String, required: true },
  stars: { type: Number, required: true, default: 5 },
  date: { type: Date, default: Date.now }
});
const Review = mongoose.model('Review', reviewSchema);

// --- ROUTES ---

// Reviews
app.get('/api/reviews', async (req, res) => {
  try {
    const reviews = await Review.find().sort({ date: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

app.post('/api/reviews', async (req, res) => {
  try {
    const { name, text, stars } = req.body;
    const newReview = new Review({ name, text, stars: stars || 5 });
    await newReview.save();
    res.status(201).json(newReview);
  } catch (err) {
    res.status(400).json({ error: "Failed to save review" });
  }
});

// ✅ FIX: NEWS PROXY (Your server calls NewsAPI so the browser doesn't have to)
app.get('/api/news', async (req, res) => {
  try {
    const apiKey = process.env.NEWS_API_KEY; 
    if (!apiKey) return res.status(500).json({ error: "API Key missing" });

    const url = `https://newsapi.org/v2/top-headlines?category=technology&language=en&apiKey=${apiKey}`;
    
    // Using global fetch (Node 18+)
    const response = await fetch(url);
    const data = await response.json();
    
    // Check if NewsAPI returned an error
    if (data.status === 'error') {
      return res.status(400).json(data);
    }
    
    res.json(data);
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.get('/', (req, res) => res.send('API is running... 🚀'));
app.use('/api/users', userRoutes); 
app.use('/api/ai', aiRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));