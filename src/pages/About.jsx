import React from 'react';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="about-page-wrapper">
      <div className="about-card">
        
        {/* Floating Back Button */}
        <button onClick={() => navigate(-1)} className="nav-back-btn">
          <i className="fa-solid fa-arrow-left"></i> Back
        </button>

        {/* Hero Header */}
        <div className="about-header">
          <h1 className="about-title">PlacementSync.</h1>
          <p className="about-subtitle">
            We are bridging the gap between ambitious students and their dream careers 
            using the power of Artificial Intelligence.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="about-grid">
          
          {/* Box 1 */}
          <div className="feature-box">
            <div className="feature-icon icon-purple">
              <i className="fa-solid fa-wand-magic-sparkles"></i>
            </div>
            <h3>AI-Driven Matching</h3>
            <p>
              Our proprietary AI algorithms analyze thousands of data points to 
              match your unique skill set with the perfect job opportunities instantly.
            </p>
          </div>

          {/* Box 2 */}
          <div className="feature-box">
            <div className="feature-icon icon-pink">
              <i className="fa-solid fa-shield-heart"></i>
            </div>
            <h3>Student First Mission</h3>
            <p>
              We believe talent is universal, but opportunity is not. We are dedicated 
              to democratizing access to career guidance for every student.
            </p>
          </div>

          {/* Box 3 */}
          <div className="feature-box">
            <div className="feature-icon icon-green">
              <i className="fa-solid fa-code"></i>
            </div>
            <h3>Built by Engineers</h3>
            <p>
              Developed by a passionate team of developers and data scientists who 
              understand the struggle of finding that first big break.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default About;