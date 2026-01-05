import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

// Create context
const ThemeContext = createContext(null);

// Custom hook to use theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    try {
      const savedTheme = localStorage.getItem('portfolio_theme');
      return savedTheme || 'dark';
    } catch (error) {
      console.error('Error reading theme from localStorage:', error);
      return 'dark';
    }
  });

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    
    try {
      localStorage.setItem('portfolio_theme', theme);
    } catch (error) {
      console.error('Error saving theme to localStorage:', error);
    }
  }, [theme]);

  // Toggle theme function
  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  }, []);

  // Set specific theme
  const setThemeMode = useCallback((mode) => {
    if (mode === 'light' || mode === 'dark') {
      setTheme(mode);
    }
  }, []);

  const value = {
    theme,
    isDark: theme === 'dark',
    toggleTheme,
    setTheme: setThemeMode
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
