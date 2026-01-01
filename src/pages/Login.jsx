import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // THE REAL BACKEND CALL
      const response = await fetch('https://placement-sync.onrender.com/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Save user info to browser storage so they stay logged in
        localStorage.setItem('userInfo', JSON.stringify(data));
        navigate('/dashboard');
      } else {
        setError(data.message || 'Invalid email or password');
      }

    } catch (err) {
      setError('Server Error. Please try again later.');
    }
  };

  return (
    <div className="main-wrapper">
      {/* LEFT SIDE: FORM */}
      <div className="form-side">
        <div className="logo-header">
          <i className="fa-solid fa-wand-magic-sparkles"></i>
          <h1>Welcome Back</h1>
          <p>Sign in to access your AI career tools.</p>
        </div>

        {error && <p style={{color: '#ef4444', marginBottom: '15px', fontWeight: 'bold'}}>{error}</p>}

        <form onSubmit={handleSubmit}>
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
              placeholder="Password" 
              required
              onChange={handleChange}
            />
            <i className="fa-solid fa-lock input-icon"></i>
          </div>

          <button type="submit" className="btn-primary">Sign In</button>
        </form>

        <div className="footer-links">
          <p>New here? <Link to="/apply">Create Account</Link></p>
        </div>
      </div>

      {/* RIGHT SIDE: ART */}
      <div className="art-side">
        <div className="glass-circle gc-1"></div>
        <div className="glass-circle gc-2"></div>
        <div className="art-content">
          <h2>PlacementSync AI</h2>
          <p>Your personal career assistant is ready.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;