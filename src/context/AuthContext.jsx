import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { authAPI } from '../api/axios';

// Create context with default value
const AuthContext = createContext({
  user: null,
  token: null,
  loading: true,
  error: null,
  login: async () => {},
  logout: () => {},
  updateUser: () => {},
  isAuthenticated: false,
  clearError: () => {},
});

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

// Helper functions for localStorage
const getLocalStorageItem = (key) => {
  try {
    if (typeof window === 'undefined') return null; // SSR check
    const item = localStorage.getItem(key);
    if (item && item !== 'undefined' && item !== 'null') {
      return item;
    }
    return null;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return null;
  }
};

const setLocalStorageItem = (key, value) => {
  try {
    if (typeof window === 'undefined') return; // SSR check
    if (value === null || value === undefined) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, value);
    }
  } catch (error) {
    console.error(`Error setting ${key} in localStorage:`, error);
  }
};

const getLocalStorageJSON = (key) => {
  try {
    const item = getLocalStorageItem(key);
    if (item) {
      return JSON.parse(item);
    }
    return null;
  } catch (error) {
    console.error(`Error parsing JSON for ${key}:`, error);
    setLocalStorageItem(key, null);
    return null;
  }
};

const clearLocalStorageAuth = () => {
  setLocalStorageItem('portfolio_token', null);
  setLocalStorageItem('portfolio_user', null);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = () => {
      try {
        const storedToken = getLocalStorageItem('portfolio_token');
        const storedUser = getLocalStorageJSON('portfolio_user');
        
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(storedUser);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        clearLocalStorageAuth();
      } finally {
        setLoading(false);
      }
    };

    // Small delay to ensure localStorage is accessible
    const timer = setTimeout(() => {
      initAuth();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Login function with actual API call
  const login = useCallback(async (credentials) => {
    try {
      setError(null);
      setLoading(true);
      
      // ACTUAL API CALL
      const response = await authAPI.login(credentials);
      const { token, user } = response.data;
      
      // Store token and user
      setLocalStorageItem('portfolio_token', token);
      setLocalStorageItem('portfolio_user', JSON.stringify(user));
      
      setToken(token);
      setUser(user);
      setLoading(false);
      
      return { success: true, user };
    } catch (error) {
      const message = error.response?.data?.message || 
                     error.response?.data?.error || 
                     error.message || 
                     'Login failed. Please check your credentials.';
      setError(message);
      setLoading(false);
      throw new Error(message);
    }
  }, []);

  // Logout function
  const logout = useCallback(() => {
    clearLocalStorageAuth();
    setToken(null);
    setUser(null);
    setError(null);
  }, []);

  // Update user function
  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser);
    setLocalStorageItem('portfolio_user', JSON.stringify(updatedUser));
  }, []);

  // Check if user is authenticated
  const isAuthenticated = !!token && !!user;

  // Clear error
  const clearError = useCallback(() => setError(null), []);

  // Context value
  const value = {
    user,
    token,
    loading,
    error,
    login,
    logout,
    updateUser,
    isAuthenticated,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

