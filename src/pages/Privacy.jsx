import React from 'react';
import { useNavigate } from 'react-router-dom';

const Privacy = () => {
  const navigate = useNavigate();

  return (
    <div className="about-page-wrapper">
      <div className="about-card">
        
        <button onClick={() => navigate(-1)} className="nav-back-btn">
          <i className="fa-solid fa-arrow-left"></i> Back
        </button>

        <div className="about-header">
          <h1 className="about-title">Privacy Policy.</h1>
          <p className="about-subtitle">Your data security is our top priority.</p>
        </div>

        <div className="about-grid">
          
          {/* Card 1 */}
          <div className="feature-box">
             <div className="feature-icon icon-purple">
               <i className="fa-solid fa-database"></i>
             </div>
             <h3>1. Data Collection</h3>
             <p>We collect essential information such as your name, email, and resume content solely to provide AI-driven career analysis.</p>
          </div>

          {/* Card 2 */}
          <div className="feature-box">
             <div className="feature-icon icon-pink">
               <i className="fa-solid fa-brain"></i>
             </div>
             <h3>2. AI Processing</h3>
             <p>Your CV is processed securely by AI to generate insights. We never share raw data with third-party recruiters.</p>
          </div>

           {/* Card 3 */}
          <div className="feature-box">
             <div className="feature-icon icon-green">
               <i className="fa-solid fa-trash-can"></i>
             </div>
             <h3>3. Data Deletion</h3>
             <p>You own your data. You can request the full deletion of your account and all associated files at any time via your dashboard.</p>
          </div>

           {/* Card 4 */}
          <div className="feature-box">
             <div className="feature-icon icon-purple">
               <i className="fa-solid fa-shield-halved"></i>
             </div>
             <h3>4. Encryption</h3>
             <p>We use industry-standard encryption to protect your login credentials and personal files from unauthorized access.</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Privacy;