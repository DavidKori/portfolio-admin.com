import React, { createContext, useState, useContext, useCallback } from 'react';
import Toast from '../components/Toast';

// Create context
export const ToastContext = createContext(null);

// Custom hook to use toast context
export const useToast = () => {
  const context = useContext(ToastContext);
  
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success', duration = 5000) => {
    const id = Date.now() + Math.random();
    
    setToasts(prevToasts => [...prevToasts, { id, message, type }]);
    
    // Auto remove toast
    setTimeout(() => {
      removeToast(id);
    }, duration);
    
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  }, []);

  // Convenience methods
  const showSuccess = useCallback((message) => showToast(message, 'success'), [showToast]);
  const showError = useCallback((message) => showToast(message, 'error'), [showToast]);
  const showWarning = useCallback((message) => showToast(message, 'warning'), [showToast]);
  const showInfo = useCallback((message) => showToast(message, 'info'), [showToast]);

  const value = {
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeToast
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-container">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

