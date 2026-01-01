import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Helper to check active state
  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <div className="sidebar">
      <div className="brand">
        <i className="fa-solid fa-bolt"></i>
        <span>PlacementSync</span>
      </div>

      <nav className="nav-menu">
        <div
          onClick={() => navigate('/dashboard')}
          className={`nav-item clickable ${isActive('/dashboard')}`}
        >
          <i className="fa-solid fa-house"></i> Dashboard
        </div>

        <div
          onClick={() => navigate('/manual-analysis')}
          className={`nav-item clickable ${isActive('/manual-analysis')}`}
        >
          <i className="fa-solid fa-wand-magic-sparkles"></i> AI Analysis
        </div>

        <div
          onClick={() => navigate('/upload')}
          className={`nav-item clickable ${isActive('/upload')}`}
        >
          <i className="fa-solid fa-file-arrow-up"></i> Upload CV
        </div>

        {/* ✅ UPDATED: Job Market now points to /job-market */}
        <div
          onClick={() => navigate('/job-market')}
          className={`nav-item clickable ${isActive('/job-market')}`}
        >
          <i className="fa-solid fa-briefcase"></i> Tech Pulse
        </div>

        {/* ✅ Navigation for My Applications */}
        <div
          onClick={() => navigate('/my-applications')}
          className={`nav-item clickable ${isActive('/my-applications')}`}
        >
          <i className="fa-solid fa-layer-group"></i>
          <span>My Applications</span>
        </div>
      </nav>

      <div className="sidebar-footer">
        <Link to="/" className="nav-item logout-btn">
          <i className="fa-solid fa-right-from-bracket"></i> Logout
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;