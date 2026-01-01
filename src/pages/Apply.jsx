import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Apply = () => {
  const navigate = useNavigate();

  // 1. Variables to hold user input
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  
  // New state for the custom popup
  const [showSuccess, setShowSuccess] = useState(false);

  // 2. Handle typing in the boxes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. Handle the "Join Now" button click
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    try {
      // THE REAL BACKEND CALL
      const response = await fetch('https://placement-sync.onrender.com/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // ✅ REPLACED ALERT WITH POPUP STATE
        setShowSuccess(true);
      } else {
        setError(data.message || 'Something went wrong');
      }

    } catch (err) {
      setError('Server Error. Is your backend running?');
    }
  };

  // 4. Handle closing the popup and moving to dashboard
  const handleClosePopup = () => {
    setShowSuccess(false);
    navigate('/dashboard'); 
  };

  return (
    <div className="main-wrapper">
      {/* LEFT SIDE: FORM */}
      <div className="form-side">
        <div className="logo-header">
          <i className="fa-solid fa-wand-magic-sparkles"></i>
          <h1>Join PlacementSync</h1>
          <p>Create your futuristic profile today.</p>
        </div>

        {error && <p style={{color: '#ef4444', marginBottom: '15px', fontWeight: 'bold'}}>{error}</p>}

        <form onSubmit={handleSubmit}>
          {/* Name Input */}
          <div className="input-group">
            <input 
              type="text" 
              name="name"
              className="input-field" 
              placeholder="Full Name" 
              required
              onChange={handleChange} 
            />
            <i className="fa-solid fa-user input-icon"></i>
          </div>

          {/* Email Input */}
          <div className="input-group">
            <input 
              type="email" 
              name="email"
              className="input-field" 
              placeholder="Email Address" 
              required
              onChange={handleChange} 
            />
            <i className="fa-solid fa-envelope input-icon"></i>
          </div>

          {/* Password Input */}
          <div className="input-group">
            <input 
              type="password" 
              name="password"
              className="input-field" 
              placeholder="Create Password" 
              required
              onChange={handleChange} 
            />
            <i className="fa-solid fa-lock input-icon"></i>
          </div>

          <button type="submit" className="btn-submit">Start Journey 🚀</button>
        </form>

        <div className="footer-links">
          <p>Already have an account? <Link to="/">Sign In</Link></p>
        </div>
      </div>

      {/* RIGHT SIDE: ART */}
      <div className="art-side">
        <div className="glass-circle gc-1"></div>
        <div className="glass-circle gc-2"></div>
        <div className="art-content">
          <h2>Sync Your Future</h2>
          <p>Join thousands of students getting AI-powered career advice.</p>
        </div>
      </div>

      {/* ✅ NEW: CUSTOM SUCCESS POPUP (Hidden by default) */}
      {showSuccess && (
        <div className="ap-modal-overlay">
          <div className="ap-modal-card">
            <div className="ap-icon-wrapper">
              <i className="fa-solid fa-check"></i>
            </div>
            <h2 className="ap-title">Welcome Aboard! 🚀</h2>
            <p className="ap-message">Registration successful. Your futuristic career journey begins now.</p>
            <button className="ap-btn-continue" onClick={handleClosePopup}>
              Enter Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Apply;