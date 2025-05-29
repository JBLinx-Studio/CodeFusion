
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { initializeGoogleClient, GOOGLE_CLIENT_ID, parseGoogleJwt } from '@/utils/googleAuth';

// Define user types and auth state
export type UserTier = 'free' | 'starter' | 'developer' | 'pro' | 'team-starter' | 'team-pro' | 'enterprise';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  tier: UserTier;
  createdAt: string;
  lastLogin: string;
  authProvider?: 'email' | 'google';
  subscriptionId?: string | null;
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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Initialize Google client when component mounts
  useEffect(() => {
    const initGoogle = async () => {
      try {
        await initializeGoogleClient();
      } catch (error) {
        console.error('Failed to initialize Google client', error);
      }
    };

    initGoogle();
  }, []);

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
        authProvider: 'email'
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
    // If the user has an active subscription, handle cleanup
    // In a real app, you might want to confirm with the user before logging out
    // if they have an active subscription
    setCurrentUser(null);
    toast.info('You have been logged out');
  };

  // Google login (real implementation)
  const googleLogin = async (): Promise<boolean> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      // Make sure Google client is initialized
      await initializeGoogleClient();
      
      if (!window.google || !window.google.accounts) {
        toast.error('Google authentication is not available');
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return false;
      }
      
      // Create a promise to handle the Google sign-in callback
      const googleSignInResult = await new Promise<{ credential: string } | null>((resolve) => {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: (response) => {
            if (response && response.credential) {
              resolve({ credential: response.credential });
            } else {
              resolve(null);
            }
          },
          auto_select: true,
        });
        
        // Prompt the user to select an account
        window.google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            // If prompt not displayed or skipped, resolve with null
            resolve(null);
          }
        });
      });
      
      // If no result, return false
      if (!googleSignInResult) {
        toast.error('Google login failed or was cancelled');
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return false;
      }
      
      // Parse the JWT to get user info
      const { email, name, picture } = parseGoogleJwt(googleSignInResult.credential);
      
      if (!email) {
        toast.error('Failed to get user information from Google');
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return false;
      }
      
      const users = getUsers();
      const existingUser = users.find(
        u => u.email.toLowerCase() === email.toLowerCase()
      );

      if (existingUser) {
        // Update existing user
        const updatedUser = {
          ...existingUser,
          lastLogin: new Date().toISOString(),
          avatar: picture || existingUser.avatar, // Update avatar if new one available
          authProvider: 'google' as const
        };
        const updatedUsers = users.map(u =>
          u.id === updatedUser.id ? updatedUser : u
        );
        saveUsers(updatedUsers);
        setCurrentUser(updatedUser);
        
        toast.success('Google login successful', {
          description: `Welcome back, ${updatedUser.name}!`,
        });
      } else {
        // Create new user
        const newUser: User = {
          id: `google_${Date.now()}`,
          email,
          name,
          avatar: picture,
          tier: 'free',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          authProvider: 'google'
        };
        
        // Save new user
        saveUsers([...users, newUser]);
        setCurrentUser(newUser);
        
        toast.success('Google login successful', {
          description: `Welcome, ${newUser.name}!`,
        });
      }
      
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

      // If updating subscription status
      if (updates.tier === 'free' && authState.user.tier !== 'free') {
        // User is downgrading from a paid plan
        console.log('User downgraded from paid plan to free plan');
      }

      const users = getUsers();
      const updatedUsers = users.map(u =>
        u.id === updatedUser.id ? updatedUser : u
      );

      saveUsers(updatedUsers);
      setCurrentUser(updatedUser);
      
      // Only show toast for non-subscription updates
      if (!('tier' in updates) && !('subscriptionId' in updates)) {
        toast.success('Profile updated');
      }
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
