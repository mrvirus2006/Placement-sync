import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Apply from './pages/Apply';
import StudentDashboard from './pages/StudentDashboard';
import UploadCV from './pages/UploadCV';
import ManualAnalysis from './pages/ManualAnalysis';
import Reviews from './pages/Reviews';
import About from './pages/About';
import Privacy from './pages/Privacy'; 
import News from './pages/News';
import MyApplications from './pages/MyApplications'; // <--- 1. ADDED THIS IMPORT
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* --- PUBLIC ROUTES --- */}
        <Route path="/" element={<Login />} />
        <Route path="/apply" element={<Apply />} />

        {/* --- PROTECTED ROUTES --- */}
        
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <StudentDashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/manual-analysis" 
          element={
            <ProtectedRoute>
              <ManualAnalysis />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/upload" 
          element={
            <ProtectedRoute>
              <UploadCV />
            </ProtectedRoute>
          } 
        />

        {/* Job Market / Tech Pulse */}
        <Route 
          path="/job-market" 
          element={
            <ProtectedRoute>
              <News />
            </ProtectedRoute>
          } 
        />

        {/* My Applications - 2. ADDED ROUTE HERE */}
        <Route 
          path="/my-applications" 
          element={
            <ProtectedRoute>
              <MyApplications />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/reviews" 
          element={
            <ProtectedRoute>
              <Reviews />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/about" 
          element={
            <ProtectedRoute>
              <About />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/privacy" 
          element={
            <ProtectedRoute>
              <Privacy />
            </ProtectedRoute>
          } 
        />

      </Routes>
    </Router>
  );
}

export default App;