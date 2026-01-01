import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Reviews = () => {
  const navigate = useNavigate();

  // 1. FIX: Start with an empty array to avoid mixing hardcoded & DB data
  const [reviews, setReviews] = useState([]);

  // 2. FIX: stars default state
  const [form, setForm] = useState({ name: '', text: '', stars: 5 });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('https://placement-sync.onrender.com/api/reviews');
        if (response.ok) {
          const data = await response.json();
          // 3. FIX: Replace state directly. Do NOT use [...prev, ...data]
          // This prevents duplicates if useEffect runs twice
          setReviews(data); 
        }
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      }
    };
    fetchReviews();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleStarClick = (rating) => {
    setForm({ ...form, stars: rating });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.text || !form.name) return;

    setIsSubmitting(true);

    const newReview = {
      id: Date.now(),
      name: form.name,
      text: form.text,
      stars: form.stars
    };

    // 4. Optimistic Update: Add new review to top of list immediately
    setReviews([newReview, ...reviews]);
    setForm({ name: '', text: '', stars: 5 });

    try {
      await fetch('https://placement-sync.onrender.com/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReview),
      });
      // No need to fetch again, we already added it to UI above
    } catch (error) {
      console.error("Error saving review:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rv-page-wrapper">
      <div className="rv-main-card">
        
        <button onClick={() => navigate(-1)} className="rv-back-btn">
          <i className="fa-solid fa-arrow-left"></i> Back
        </button>

        <div className="rv-header">
          <h1 className="rv-title">Student Reviews</h1>
          <p className="rv-subtitle">See what your peers are saying about PlacementSync.</p>
        </div>

        <div className="rv-form-container">
          <h3>Write a Review</h3>
          <form onSubmit={handleSubmit} className="rv-form">
            
            <div className="rv-star-select">
              <span className="rv-label">Your Rating:</span>
              <div className="rv-rating-icons">
                {[1, 2, 3, 4, 5].map((star) => (
                  <i 
                    key={star}
                    onClick={() => handleStarClick(star)}
                    className={`fa-solid fa-star ${star <= form.stars ? 'active' : ''}`}
                  ></i>
                ))}
              </div>
            </div>

            <div className="rv-input-group">
               <input 
                 type="text" 
                 name="name"
                 className="rv-input"
                 placeholder="Your Name"
                 value={form.name}
                 onChange={handleChange}
                 required
               />
            </div>
            <div className="rv-input-group">
               <textarea 
                 rows="3" 
                 name="text"
                 className="rv-textarea"
                 placeholder="Share your experience..." 
                 value={form.text}
                 onChange={handleChange}
                 required
               ></textarea>
            </div>
            <button type="submit" className="rv-btn-submit" disabled={isSubmitting}>
              {isSubmitting ? 'Posting...' : 'Post Review'}
            </button>
          </form>
        </div>

        <div className="rv-grid">
          {reviews.map((r) => (
            <div key={r.id} className="rv-card">
              <div className="rv-stars">
                {[...Array(r.stars || 5)].map((_, i) => <i key={i} className="fa-solid fa-star"></i>)}
              </div>
              <p className="rv-text">"{r.text}"</p>
              <div className="rv-user-info">
                 <div className="rv-avatar">
                    {r.name ? r.name.charAt(0).toUpperCase() : 'U'}
                 </div>
                 <span className="rv-username">{r.name}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Reviews;