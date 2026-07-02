// context/AuthContext.js
// AuthContext provides global authentication state to the entire app.
//
// Without Context, we'd have to pass user data as props
// from parent to child to grandchild — called "prop drilling".
// Context solves this by making data available to ANY component
// directly, no matter how deep it is in the tree.

import React, { createContext, useState, useEffect, useContext } from 'react';
import { registerUser, loginUser, getMe } from '../api/authApi';

// Step 1: Create the context object
const AuthContext = createContext();

// Step 2: Create the Provider component
// This wraps our entire app and provides auth state everywhere
export const AuthProvider = ({ children }) => {

  // user → stores logged in user object (null if not logged in)
  const [user, setUser] = useState(null);

  // token → JWT token stored in localStorage
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  // loading → true while we're checking if user is logged in
  const [loading, setLoading] = useState(true);

  // ==================== CHECK IF ALREADY LOGGED IN ====================
  // When app first loads, check if a token exists in localStorage.
  // If yes, fetch user details from backend to restore the session.
  // This prevents user from being logged out on page refresh.

  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const data = await getMe(token);
          setUser(data.user);
        } catch (error) {
          // Token is invalid or expired — clear everything
          console.error('Token invalid:', error);
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  // ==================== REGISTER ====================
  const register = async (userData) => {
    const data = await registerUser(userData);

    // Save token to localStorage so it persists on refresh
    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUser(data.user);

    return data;
  };

  // ==================== LOGIN ====================
  const login = async (userData) => {
    const data = await loginUser(userData);

    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUser(data.user);

    return data;
  };

  // ==================== LOGOUT ====================
  const logout = () => {
    // Remove token from localStorage
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  // Values and functions available to ALL components
  const value = {
    user,
    token,
    loading,
    register,
    login,
    logout,
    isAuthenticated: !!user  // true if user exists, false if null
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Step 3: Custom hook to use AuthContext easily
// Instead of writing useContext(AuthContext) every time,
// any component can just write useAuth()

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
};

export default AuthContext;