import React from 'react';
import '../styles/loader.css';

const Loader = ({ size = 'medium', text = 'Loading...', fullscreen = false }) => {
  if (fullscreen) {
    return (
      <div className="loader-fullscreen">
        <div className={`loader-spinner ${size}`}></div>
        {text && <p className="loader-text">{text}</p>}
      </div>
    );
  }

  return (
    <div className={`loader-container ${size}`}>
      <div className="loader-spinner"></div>
      {text && <p className="loader-text">{text}</p>}
    </div>
  );
};

export default Loader;


