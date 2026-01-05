import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { messagesAPI, projectsAPI } from '../api/axios';
import Loader from '../components/Loader';
import '../styles/dashboard-home.css';

const DashboardHome = () => {
  const [stats, setStats] = useState({
    messages: 0,
    projects: 0,
    unreadMessages: 0,
    recentMessages: []
  });
  const [loading, setLoading] = useState(true);
  const { isDark } = useTheme();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // ACTUAL API CALLS
      const [messagesRes, projectsRes] = await Promise.all([
        messagesAPI.getAll(),
        projectsAPI.getAll()
      ]);
      
      const messages = messagesRes.data || [];
      const projects = projectsRes.data || [];
      
      setStats({
        messages: messages.length,
        projects: projects.length,
        unreadMessages: messages.filter(m => !m.read).length,
        recentMessages: messages.slice(0, 5)
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      // Set defaults on error
      setStats({
        messages: 0,
        projects: 0,
        unreadMessages: 0,
        recentMessages: []
      });
    } finally {
      setLoading(false);
    }
  };

  const quickLinks = [
    { to: '/dashboard/profile', label: 'Update Profile', icon: '👤' },
    { to: '/dashboard/projects', label: 'Add Project', icon: '➕' },
    { to: '/dashboard/messages', label: 'View Messages', icon: '✉️' },
    { to: '/dashboard/blogs', label: 'Write Blog', icon: '📝' },
  ];

  if (loading) {
    return <Loader text="Loading dashboard data..." />;
  }

  return (
    <div className="dashboard-home">
      <div className="dashboard-header">
        <h1>Welcome back, Admin</h1>
        <p>Manage your professional portfolio from here</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>Total Projects</h3>
            <p className="stat-number">{stats.projects}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">✉️</div>
          <div className="stat-content">
            <h3>Messages</h3>
            <p className="stat-number">{stats.messages}</p>
            {stats.unreadMessages > 0 && (
              <span className="unread-badge">{stats.unreadMessages} new</span>
            )}
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🚀</div>
          <div className="stat-content">
            <h3>Quick Actions</h3>
            <p className="stat-number">{quickLinks.length}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <h3>Portfolio Views</h3>
            <p className="stat-number">Coming Soon</p>
          </div>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="section quick-actions">
          <h2>Quick Actions</h2>
          <div className="quick-links">
            {quickLinks.map((link) => (
              <Link key={link.to} to={link.to} className="quick-link">
                <span className="quick-link-icon">{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="section recent-activity">
          <h2>Recent Messages</h2>
          <div className="activity-list">
            {stats.recentMessages.length > 0 ? (
              stats.recentMessages.map((message) => (
                <div key={message._id} className="activity-item">
                  <div className="activity-icon">📩</div>
                  <div className="activity-content">
                    <p className="activity-title">{message.name || 'Unknown'}</p>
                    <p className="activity-text">
                      {message.message ? 
                        (message.message.substring(0, 60) + (message.message.length > 60 ? '...' : '')) 
                        : 'No message content'
                      }
                    </p>
                    <span className="activity-time">
                      {message.createdAt ? 
                        new Date(message.createdAt).toLocaleDateString() 
                        : 'Unknown date'
                      }
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-activity">No recent messages</p>
            )}
          </div>
          {stats.recentMessages.length > 0 && (
            <Link to="/dashboard/messages" className="view-all-link">
              View all messages →
            </Link>
          )}
        </div>
      </div>

      <div className="dashboard-tips">
        <h3>💡 Pro Tips</h3>
        <ul>
          <li>Keep your profile information up-to-date</li>
          <li>Upload high-quality images for projects</li>
          <li>Regularly check and respond to messages</li>
          <li>Use tags to categorize your skills and projects</li>
        </ul>
      </div>
    </div>
  );
};

export default DashboardHome;

