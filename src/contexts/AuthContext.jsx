import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../apis';
import { API_ROUTES } from '../apis/apiRoutes';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('iams_token');
    const storedUser = localStorage.getItem('iams_user');
    
    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setToken(storedToken);
      } catch (err) {
        console.error('Failed to parse stored user data:', err);
        localStorage.removeItem('iams_token');
        localStorage.removeItem('iams_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    setError(null);
    setIsLoading(true);
    
    try {
      const response = await apiClient.post(API_ROUTES.auth.login, {
        email,
        password
      });
      
      if (response.success) {
        const { token: authToken, user: userData } = response;
        
        // Store in localStorage
        localStorage.setItem('iams_token', authToken);
        localStorage.setItem('iams_user', JSON.stringify(userData));
        
        // Update state
        setToken(authToken);
        setUser(userData);
        
        return { success: true, user: userData };
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (err) {
      const errorMessage = err.message || 'Login failed. Please check your credentials.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Call logout API if available
      if (token) {
        await apiClient.post(API_ROUTES.auth.logout);
      }
    } catch (err) {
      console.error('Logout API call failed:', err);
    } finally {
      // Clear local storage and state
      localStorage.removeItem('iams_token');
      localStorage.removeItem('iams_user');
      setUser(null);
      setToken(null);
      setError(null);
    }
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('iams_user', JSON.stringify(userData));
  };

  const isAuthenticated = () => {
    return !!token && !!user;
  };

  const register = async (userData) => {
    setError(null);
    setIsLoading(true);
    
    try {
      // Import registerService dynamically to avoid circular dependency
      const { registerService } = await import('../shared/register/services/registerService');
      
      const response = await registerService.registerUser(userData);
      
      if (response.success) {
        const { user: userData, token: authToken } = response;
        
        // Store in localStorage (only if no approval required)
        if (!response.requiresApproval) {
          localStorage.setItem('iams_token', authToken);
          localStorage.setItem('iams_user', JSON.stringify(userData));
          
          // Update state
          setToken(authToken);
          setUser(userData);
        }
        
        return { 
          success: true, 
          user: userData, 
          requiresApproval: response.requiresApproval 
        };
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (err) {
      const errorMessage = err.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const hasRole = (role) => {
    return user?.role === role;
  };

  const value = {
    user,
    token,
    isLoading,
    error,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated,
    hasRole
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
