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

// ✅ UPDATED NEWS PROXY: JOB MARKET FOCUS
app.get('/api/news', async (req, res) => {
  try {
    const apiKey = process.env.NEWS_API_KEY || process.env.VITE_NEWS_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "API Key missing in Render settings" });

    // ✅ NEW STRATEGY: Focus on Action Keywords + Industry
    // This looks for "hiring" or "jobs" specifically within the tech sector.
    const query = encodeURIComponent(
      '("tech hiring" OR "software engineer jobs" OR "developer salary" OR "remote work" OR "tech layoffs")'
    );
    
    // We add 'business' and 'technology' categories to filter out gadget reviews and general tech news.
    const url = `https://newsdata.io/api/1/news?apikey=${apiKey}&q=${query}&language=en&category=technology,business`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "error") {
      const errorMsg = data.results?.message || data.message || "Unknown API error";
      return res.status(400).json({ status: 'error', message: errorMsg });
    }

    const articles = (data.results || []).map(article => ({
      title: article.title || "Job Market Update",
      description: article.description || "Stay ahead of the curve with the latest hiring trends and market shifts.",
      url: article.link || "#",
      image: article.image_url, 
      publishedAt: article.pubDate,
      source: { name: article.source_id || "Career Insights" }
    }));

    res.json({ articles }); 
  } catch (err) {
    console.error("News Proxy Error:", err);
    res.status(500).json({ status: 'error', message: "Internal server error fetching news" });
  }
});

app.get('/', (req, res) => res.send('API is running... 🚀'));
app.use('/api/users', userRoutes);
app.use('/api/ai', aiRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));