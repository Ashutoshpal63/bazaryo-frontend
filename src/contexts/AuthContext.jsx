import React, { createContext, useState, useContext, useEffect, useMemo, useCallback } from 'react';
import { loginUser, registerUser, logoutUser } from '../api/authApi';
import { getMyProfile } from '../api/userApi';
import { Spinner } from '../components/common/Spinner';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const validateSession = useCallback(async () => {
    try {
      const response = await getMyProfile();
      setUser(response.data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    validateSession();
  }, [validateSession]);

  const login = async (credentials) => {
    const response = await loginUser(credentials);
    setUser(response.data.user);
    toast.success(`Welcome back, ${response.data.user.name.split(' ')[0]}!`);
    return response.data.user; // Return user object for role-based redirect
  };

  const register = async (userData) => {
    const response = await registerUser(userData);
    setUser(response.data.user);
    toast.success(`Welcome to Bazaryo, ${response.data.user.name.split(' ')[0]}!`);
    return response.data.user; // Return user object for role-based redirect
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout failed:", error.response?.data?.message || error.message);
    } finally {
      setUser(null);
      toast.success("You have been logged out.");
    }
  };
  
  // New function to allow components to refresh user data
  const refreshUser = async () => {
    await validateSession();
  };

  const contextValue = useMemo(() => ({
    user,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout,
    refreshUser, // Expose the refresh function
  }), [user, loading, validateSession]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};