import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/landing.css';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <div className="landing-content">
        <div className="landing-header">
          <h1 className="landing-title">Portfolio<span className="highlight">CMS</span></h1>
          <p className="landing-subtitle">Professional Developer Portfolio Management System</p>
        </div>
        
        <div className="landing-features">
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Complete Control</h3>
            <p>Manage every aspect of your portfolio without touching code</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🖼️</div>
            <h3>Media Management</h3>
            <p>Upload and organize images, videos, and documents with ease</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🎨</div>
            <h3>Professional Design</h3>
            <p>Dark/Light themes with a modern, clean interface</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Real-time Updates</h3>
            <p>See changes instantly with optimistic UI updates</p>
          </div>
        </div>
        
        <div className="landing-action">
          <button 
            className="login-btn"
            onClick={() => navigate('/login')}
          >
            Admin Login
          </button>
          <p className="login-note">Secure access for portfolio owner only</p>
        </div>
      </div>
    </div>
  );
};

export default Landing;