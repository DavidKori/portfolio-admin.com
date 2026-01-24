import React, { useState } from 'react';
import '../styles/ToggleBtn.css';

const ToggleButton = ({
  isOn: controlledIsOn,
  onToggle,
  status,
  size = 'medium',
  variant = 'default',
  disabled = false,
  labels = { on: 'ON', off: 'OFF' },
  icons = null,
  className = '',
  id = '',
  ariaLabel = '',
  showLabels = true,
  showIcons = true,

}) => {
  // Use controlled or uncontrolled state
  const [internalIsOn, setInternalIsOn] = useState(status);
  const isOn = controlledIsOn !== undefined ? controlledIsOn : internalIsOn;
  const [publishModal,setPublishModal] = useState(false)

  const handleToggle = () => {
    if (disabled) return;
    
    if (controlledIsOn === undefined) {
      setInternalIsOn(!isOn);
    }
    
    if (onToggle) {
      onToggle(!isOn);
    }
    publishModal === false ? setPublishModal(true):setPublishModal(false);

//    status = isOn === false ? 'draft' : 'published';
    // console.log(isOn, controlledIsOn, internalIsOn, status)
  };
    console.log(isOn, controlledIsOn, internalIsOn, status)

  const handleKeyDown = (e) => {
    if (disabled) return;
    
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggle();
    }
  };
  

 
  return (
    <div
      className={`toggle-button-wrapper ${className}`}
      data-size={size}
      data-variant={variant}
      data-state={isOn ? 'on' : 'off'}
      data-disabled={disabled}
    >
      <button
        id={id}
        className={`toggle-button ${isOn ? 'on' : 'off'}`}
        onClick={() => handleToggle()}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        aria-pressed={isOn}
        aria-label={ariaLabel || `Toggle ${isOn ? 'off' : 'on'}`}
        aria-disabled={disabled}
        role="switch"
        tabIndex={disabled ? -1 : 0}
      >
        {/* Toggle track */}
        <div className="toggle-track">
          {/* On label/icon */}
          <span className="toggle-content on-content">
            {showIcons && icons?.on && (
              <span className="toggle-icon" aria-hidden="true">
                {icons.on}
              </span>
            )}
            {showLabels && labels.on && (
              <span className="toggle-label">{labels.on}</span>
            )}
          </span>

          {/* Off label/icon */}
          <span className="toggle-content off-content">
            {showIcons && icons?.off && (
              <span className="toggle-icon" aria-hidden="true">
                {icons.off}
              </span>
            )}
            {showLabels && labels.off && (
              <span className="toggle-label">{labels.off}</span>
            )}
          </span>
        </div>

        {/* Toggle thumb */}
        <div className="toggle-thumb">
          {showIcons && icons?.thumb && (
            <span className="toggle-thumb-icon" aria-hidden="true">
              {icons.thumb}
            </span>
          )}
        </div>
      </button>

    </div>
  );
};

// Example usage component
// export const ToggleExample = () => {
//   const [isDarkMode, setIsDarkMode] = useState(false);
//   const [notifications, setNotifications] = useState(true);
//   const [autoSave, setAutoSave] = useState(false);

// //   return (
// //     <div className={`app ${isDarkMode ? 'dark' : 'light'}`}>
// //       <div className="toggle-examples">
// //         <h2>Toggle Examples</h2>
        
// //         {/* Dark Mode Toggle */}
// //         <div className="toggle-group">
// //           <label>Dark Mode</label>
// //           <ToggleButton
// //             isOn={isDarkMode}
// //             onToggle={setIsDarkMode}
// //             icons={{
// //               on: '🌙',
// //               off: '☀️'
// //             }}
// //             labels={{ on: 'Dark', off: 'Light' }}
// //             variant="rounded"
// //           />
// //         </div>

// //         {/* Notifications Toggle */}
// //         <div className="toggle-group">
// //           <label>Notifications</label>
// //           <ToggleButton
// //             isOn={notifications}
// //             onToggle={setNotifications}
// //             icons={{
// //               on: '🔔',
// //               off: '🔕'
// //             }}
// //             labels={{ on: 'On', off: 'Off' }}
// //             variant="rounded"
// //             size="small"
// //           />
// //         </div>

// //         {/* Auto Save Toggle */}
// //         <div className="toggle-group">
// //           <label>Auto Save</label>
// //           <ToggleButton
// //             isOn={autoSave}
// //             onToggle={setAutoSave}
// //             icons={{
// //               on: '💾',
// //               off: '📁'
// //             }}
// //             labels={{ on: 'Auto', off: 'Manual' }}
// //             variant="rounded"
// //             size="large"
// //           />
// //         </div>

// //         {/* Compact Toggle */}
// //         <div className="toggle-group">
// //           <label>Compact View</label>
// //           <ToggleButton
// //             labels={{ on: '', off: '' }}
// //             icons={{
// //               thumb: '○'
// //             }}
// //             variant="compact"
// //             size="small"
// //           />
// //         </div>

// //         {/* Disabled Toggle */}
// //         <div className="toggle-group">
// //           <label>Disabled Option</label>
// //           <ToggleButton
// //             disabled={true}
// //             labels={{ on: 'Enabled', off: 'Disabled' }}
// //             variant="default"
// //           />
// //         </div>

// //         {/* Accessibility Example */}
// //         <div className="toggle-group">
// //           <label htmlFor="accessibility-toggle">Accessibility Focus</label>
// //           <ToggleButton
// //             id="accessibility-toggle"
// //             ariaLabel="Toggle accessibility features"
// //             labels={{ on: 'On', off: 'Off' }}
// //             variant="default"
// //           />
// //         </div>
// //       </div>
// //     </div>
// //   );
// };

export default ToggleButton;