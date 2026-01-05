import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import '../styles/topbar.css';

const Topbar = () => {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="breadcrumb">
          <span className="breadcrumb-item">Dashboard</span>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-item current">Overview</span>
        </div>
      </div>
      
      <div className="topbar-right">
        <button 
          className="theme-toggle"
          onClick={toggleTheme}
          title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
          aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        >
          {isDark ? '☀️' : '🌙'}
        </button>
        
        <div className="user-profile">
          <div className="user-avatar">A</div>
          <div className="user-info">
            <span className="user-name">Admin</span>
            <span className="user-role">Portfolio Manager</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;

