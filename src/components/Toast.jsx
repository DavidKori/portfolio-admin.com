import React, { useEffect, useState } from 'react';
import '../styles/toast.css';

const Toast = ({ message, type = 'success', onClose, duration = 5000 }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      startExit();
    }, duration - 300); // Start exit animation 300ms before actual removal

    return () => clearTimeout(timer);
  }, [duration]);

  const startExit = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const getIcon = () => {
    switch (type) {
      case 'success': return '✓';
      case 'error': return '✕';
      case 'warning': return '⚠';
      case 'info': return 'ℹ';
      default: return '✓';
    }
  };

  return (
    <div className={`toast ${type} ${isExiting ? 'exiting' : ''}`}>
      <div className="toast-icon">{getIcon()}</div>
      <div className="toast-content">
        <p className="toast-message">{message}</p>
      </div>
      <button className="toast-close" onClick={startExit}>
        ✕
      </button>
    </div>
  );
};

export default Toast;