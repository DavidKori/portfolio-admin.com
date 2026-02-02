import React, { useState, useEffect,useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/sidebar.css';
import { UnreadContext } from '../context/unreadContext';

const Sidebar = () => {
  const { unreadCount } = useContext(UnreadContext);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const menuItems = [
    { path: '/dashboard', icon: '🏠', label: 'Dashboard' },
    { path: '/dashboard/profile', icon: '👤', label: 'Profile' },
    { path: '/dashboard/about', icon: '📝', label: 'About' },
    { path: '/dashboard/skills', icon: '⚡', label: 'Skills' },
    { path: '/dashboard/projects', icon: '💼', label: 'Projects' },
    { path: '/dashboard/experience', icon: '💼', label: 'Experience' },
    { path: '/dashboard/education', icon: '🎓', label: 'Education' },
    { path: '/dashboard/certifications', icon: '📜', label: 'Certifications' },
    { path: '/dashboard/achievements', icon: '🏆', label: 'Achievements' },
    { path: '/dashboard/blogs', icon: '📚', label: 'Blogs' },
    { path: '/dashboard/testimonials', icon: '💬', label: 'Testimonials' },
    { path: '/dashboard/resume', icon: '📄', label: 'Resume' },
    { path: '/dashboard/contact', icon: '📱', label: 'Contact' },
    { path: '/dashboard/social-links', icon: '🔗', label: 'Social Links' },
    { path: '/dashboard/messages', icon: '✉️', label: 'Messages' ,news:`${unreadCount}`},
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleMobileSidebar = () => {
    setMobileOpen(!mobileOpen);
  };

  const closeMobileSidebar = () => {
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button 
        className="mobile-menu-btn"
        onClick={toggleMobileSidebar}
        aria-label="Toggle menu"
      >
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
      </button>

      {/* Overlay for mobile when sidebar is open */}
      {mobileOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={closeMobileSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <button 
            className="collapse-btn"
            onClick={toggleSidebar}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? '→' : '←'}
          </button>
          {!collapsed && (
            <div className="sidebar-title">
              <center><h2 >Portfolio <span className="highlight">CMS</span></h2></center>
            </div>
          )}
          
          {/* Close button for mobile */}
          <button 
            className="mobile-close-btn"
            onClick={closeMobileSidebar}
            aria-label="Close menu"
          >
            ×
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `nav-item ${isActive ? 'active' : ''}`
              }
              onClick={closeMobileSidebar}
            >
              <span className="nav-icon">{item.icon}</span>
              {!collapsed && <span className="nav-label">{item.label}</span>}
              {unreadCount !== 0 && item.news && !collapsed &&<span className='news-count'>{unreadCount}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <span className="logout-icon">🚪</span>
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
