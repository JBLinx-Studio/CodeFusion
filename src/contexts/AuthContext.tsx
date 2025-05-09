
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

// Define user types and auth state
export type UserTier = 'free' | 'premium' | 'pro';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  tier: UserTier;
  createdAt: string;
  lastLogin: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextProps {
  authState: AuthState;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  googleLogin: () => Promise<boolean>;
  updateUserProfile: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Mock database for demo purposes (in a real app this would connect to your backend)
const USERS_STORAGE_KEY = 'codeplayground-users';
const CURRENT_USER_KEY = 'codeplayground-current-user';

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Load saved auth state on mount
  useEffect(() => {
    const loadAuthState = () => {
      try {
        const savedUserJson = localStorage.getItem(CURRENT_USER_KEY);
        if (!savedUserJson) {
          setAuthState(prev => ({ ...prev, isLoading: false }));
          return;
        }

        const savedUser = JSON.parse(savedUserJson);
        setAuthState({
          user: savedUser,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error) {
        console.error('Failed to load auth state:', error);
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    };

    loadAuthState();
  }, []);

  // Save users to localStorage
  const saveUsers = (users: User[]) => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  };

  // Get users from localStorage
  const getUsers = (): User[] => {
    try {
      const usersJson = localStorage.getItem(USERS_STORAGE_KEY);
      return usersJson ? JSON.parse(usersJson) : [];
    } catch (error) {
      console.error('Failed to get users:', error);
      return [];
    }
  };

  // Set current user and save to localStorage
  const setCurrentUser = (user: User | null) => {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  };

  // Login with email and password
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));

      const users = getUsers();
      const user = users.find(
        u => u.email.toLowerCase() === email.toLowerCase()
      );

      if (!user) {
        toast.error('Invalid email or password');
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return false;
      }

      // In a real app, you'd verify the password hash here
      // For demo, we'll just simulate a successful login
      const updatedUser = {
        ...user,
        lastLogin: new Date().toISOString(),
      };

      // Update user in the users array
      const updatedUsers = users.map(u =>
        u.id === updatedUser.id ? updatedUser : u
      );
      saveUsers(updatedUsers);

      // Set current user
      setCurrentUser(updatedUser);
      toast.success('Login successful', {
        description: `Welcome back, ${updatedUser.name}!`,
      });
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed');
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return false;
    }
  };

  // Register with email, password and name
  const register = async (
    email: string,
    password: string,
    name: string
  ): Promise<boolean> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const users = getUsers();
      const existingUser = users.find(
        u => u.email.toLowerCase() === email.toLowerCase()
      );

      if (existingUser) {
        toast.error('Email already in use');
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return false;
      }

      // Create new user
      const newUser: User = {
        id: `user_${Date.now()}`,
        email,
        name,
        tier: 'free',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };

      // Save new user
      saveUsers([...users, newUser]);

      // Set current user
      setCurrentUser(newUser);
      toast.success('Registration successful', {
        description: `Welcome, ${newUser.name}!`,
      });
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed');
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return false;
    }
  };

  // Logout user
  const logout = () => {
    setCurrentUser(null);
    toast.info('You have been logged out');
  };

  // Google login (simulated)
  const googleLogin = async (): Promise<boolean> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1200));

      // In a real app, this would be handled by Google OAuth
      // For demo purposes, we create a mock Google user
      const mockGoogleUser = {
        id: `google_${Date.now()}`,
        email: `user${Math.floor(Math.random() * 1000)}@gmail.com`,
        name: 'Google User',
        avatar: 'https://cdn-icons-png.flaticon.com/512/2991/2991148.png',
        tier: 'free' as UserTier,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };

      const users = getUsers();
      const existingUser = users.find(
        u => u.email.toLowerCase() === mockGoogleUser.email.toLowerCase()
      );

      if (existingUser) {
        // Update existing user
        const updatedUser = {
          ...existingUser,
          lastLogin: new Date().toISOString(),
        };
        const updatedUsers = users.map(u =>
          u.id === updatedUser.id ? updatedUser : u
        );
        saveUsers(updatedUsers);
        setCurrentUser(updatedUser);
      } else {
        // Save new user
        saveUsers([...users, mockGoogleUser]);
        setCurrentUser(mockGoogleUser);
      }

      toast.success('Google login successful', {
        description: `Welcome${existingUser ? ' back' : ''}, ${
          existingUser ? existingUser.name : mockGoogleUser.name
        }!`,
      });
      return true;
    } catch (error) {
      console.error('Google login error:', error);
      toast.error('Google login failed');
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return false;
    }
  };

  // Update user profile
  const updateUserProfile = (updates: Partial<User>) => {
    if (!authState.user) {
      toast.error('You must be logged in to update your profile');
      return;
    }

    try {
      const updatedUser = {
        ...authState.user,
        ...updates,
      };

      const users = getUsers();
      const updatedUsers = users.map(u =>
        u.id === updatedUser.id ? updatedUser : u
      );

      saveUsers(updatedUsers);
      setCurrentUser(updatedUser);
      toast.success('Profile updated');
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error('Failed to update profile');
    }
  };

  const value = {
    authState,
    login,
    register,
    logout,
    googleLogin,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthProvider };
