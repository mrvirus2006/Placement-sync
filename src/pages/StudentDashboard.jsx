import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [greeting, setGreeting] = useState('Good Day');
  const [showNotifications, setShowNotifications] = useState(false); // 🔔 NEW STATE

  // State for dynamic stats
  const [stats, setStats] = useState({
    profileScore: 50,
    applied: 0,
    saved: 0
  });

  // 🔔 MOCK NOTIFICATIONS DATA
  const notifications = [
    { id: 1, text: "Your resume analysis is complete.", time: "2 min ago", unread: true },
    { id: 2, text: "New tech news available in Tech Pulse.", time: "1 hour ago", unread: false },
    { id: 3, text: "Welcome to Placement Sync!", time: "1 day ago", unread: false },
  ];

  // Set greeting based on time
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  // ✅ CALCULATE REAL STATS & PROFILE SCORE
  useEffect(() => {
    const calculateStats = () => {
      const savedData = localStorage.getItem('myApplications');
      
      if (savedData) {
        const apps = JSON.parse(savedData);
        
        const appliedCount = apps.filter(app => 
          app.status === 'Applied' || app.status === 'Interviewing'
        ).length;
        
        const savedCount = apps.filter(app => app.status === 'Saved').length;

        const totalApps = apps.length;
        let calculatedScore = 50 + (totalApps * 5);
        if (calculatedScore > 100) calculatedScore = 100;

        setStats({
          profileScore: calculatedScore,
          applied: appliedCount,
          saved: savedCount
        });
      } else {
        setStats({
          profileScore: 50,
          applied: 0,
          saved: 0
        });
      }
    };

    calculateStats();
    window.addEventListener('storage', calculateStats);
    return () => window.removeEventListener('storage', calculateStats);
  }, []);

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <div className="dashboard-container">

      {/* 1. GLASS SIDEBAR */}
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

          <div
            onClick={() => navigate('/job-market')}
            className={`nav-item clickable ${isActive('/job-market')}`}
          >
            <i className="fa-solid fa-briefcase"></i> Tech Pulse
          </div>

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

      {/* 2. MAIN CONTENT AREA */}
      <div className="main-content">

        {/* HEADER */}
        <div className="top-header">
          <div className="header-text">
            <h1>{greeting}, Future Techie! 🚀</h1>
            <p>Ready to accelerate your career journey today?</p>
          </div>
          
          <div className="user-profile">
            
            {/* 🔔 NEW NOTIFICATION WRAPPER */}
            <div className="notification-wrapper">
              <div 
                className="icon-container" 
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <i className="fa-solid fa-bell"></i>
                <span className="notification-badge"></span>
              </div>

              {/* DROPDOWN MENU */}
              {showNotifications && (
                <div className="notification-dropdown">
                  <div className="notif-header">
                    <h4>Notifications</h4>
                    <span onClick={() => setShowNotifications(false)}>Mark all read</span>
                  </div>
                  
                  <div className="notif-list">
                    {notifications.map((notif) => (
                      <div key={notif.id} className={`notif-item ${notif.unread ? 'unread' : ''}`}>
                        <div className="notif-icon">
                          <i className="fa-solid fa-circle-info"></i>
                        </div>
                        <div className="notif-content">
                          <p>{notif.text}</p>
                          <span>{notif.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {/* END NOTIFICATION WRAPPER */}

            <div className="avatar-circle">AD</div>
          </div>
        </div>

        {/* 3. QUICK STATS ROW */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-icon icon-blue"><i className="fa-solid fa-chart-line"></i></div>
            <div className="stat-info">
              <h4>Profile Score</h4>
              <span>{stats.profileScore}%</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon icon-purple"><i className="fa-solid fa-briefcase"></i></div>
            <div className="stat-info">
              <h4>Jobs Applied</h4>
              <span>{stats.applied}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon icon-pink"><i className="fa-solid fa-heart"></i></div>
            <div className="stat-info">
              <h4>Saved Jobs</h4>
              <span>{stats.saved}</span>
            </div>
          </div>
        </div>

        {/* 4. MAIN ACTIONS */}
        <h2 className="section-title">Start Your Analysis</h2>
        <div className="action-grid">

          <div className="action-card manual-card" onClick={() => navigate('/manual-analysis')}>
            <div className="card-glow"></div>
            <div className="action-icon">
              <i className="fa-solid fa-fingerprint"></i>
            </div>
            <h3>Manual Scanner</h3>
            <p>
              Input your details step-by-step. Perfect for students
              who want a precise, tailored roadmap.
            </p>
            <span className="action-link">Start Now <i className="fa-solid fa-arrow-right"></i></span>
          </div>

          <div className="action-card upload-card" onClick={() => navigate('/upload')}>
            <div className="card-glow"></div>
            <div className="action-icon">
              <i className="fa-solid fa-cloud-arrow-up"></i>
            </div>
            <h3>AI Resume Upload</h3>
            <p>
              Drop your PDF resume here. Our AI will extract skills,
              detect gaps, and match you with jobs instantly.
            </p>
            <span className="action-link">Upload CV <i className="fa-solid fa-arrow-right"></i></span>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="dashboard-footer">
          <p>
            &copy; 2025 PlacementSync.
            <Link to="/about">About</Link> •
            <Link to="/privacy">Privacy</Link> •
            <Link to="/reviews">Reviews</Link>
          </p>
        </footer>

      </div>
    </div>
  );
};

export default StudentDashboard;