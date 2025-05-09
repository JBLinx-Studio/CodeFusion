
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define user tiers
export type UserTier = 'free' | 'premium' | 'pro';

// Define user authentication state
interface UserAuth {
  isAuthenticated: boolean;
  username: string | null;
  email: string | null;
  tier: UserTier;
  avatar?: string;
}

interface EditorSettings {
  fontSize: string;
  tabSize: number;
  autoUpdate: boolean;
  theme: string;
  showLineNumbers: boolean;
  autoCloseBrackets: boolean;
  wordWrap: boolean;
  highlightActiveLine: boolean;
  keymap: string;
  autosave: boolean;
  formatOnSave: boolean;
  liveCollaboration: boolean;
  syntaxHighlighting: string;
}

interface SettingsContextProps {
  settings: EditorSettings;
  updateSettings: (newSettings: Partial<EditorSettings>) => void;
  userAuth: UserAuth;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, username: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUserTier: (tier: UserTier) => void;
}

const defaultSettings: EditorSettings = {
  fontSize: '14px',
  tabSize: 2,
  autoUpdate: true,
  theme: 'dark',
  showLineNumbers: true,
  autoCloseBrackets: true,
  wordWrap: false,
  highlightActiveLine: true,
  keymap: 'default',
  autosave: true,
  formatOnSave: false,
  liveCollaboration: false,
  syntaxHighlighting: 'default'
};

const defaultUserAuth: UserAuth = {
  isAuthenticated: false,
  username: null,
  email: null,
  tier: 'free'
};

const SettingsContext = createContext<SettingsContextProps | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<EditorSettings>(defaultSettings);
  const [userAuth, setUserAuth] = useState<UserAuth>(defaultUserAuth);

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('codeplayground-settings');
    
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (e) {
        console.error('Failed to load settings:', e);
      }
    }

    // Load user auth from localStorage
    const savedUserAuth = localStorage.getItem('codeplayground-auth');
    
    if (savedUserAuth) {
      try {
        setUserAuth(JSON.parse(savedUserAuth));
      } catch (e) {
        console.error('Failed to load user auth:', e);
      }
    }
  }, []);

  // Save to localStorage when settings change
  useEffect(() => {
    localStorage.setItem('codeplayground-settings', JSON.stringify(settings));
  }, [settings]);

  // Save to localStorage when user auth changes
  useEffect(() => {
    localStorage.setItem('codeplayground-auth', JSON.stringify(userAuth));
  }, [userAuth]);

  const updateSettings = (newSettings: Partial<EditorSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  // Mock authentication functions
  // In a real app, these would connect to a backend
  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication logic
    if (email && password) {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // For demo purposes, any non-empty credentials will work
      const mockUserData = {
        isAuthenticated: true,
        username: email.split('@')[0],
        email,
        tier: 'free' as UserTier
      };
      
      setUserAuth(mockUserData);
      return true;
    }
    return false;
  };

  const signup = async (email: string, username: string, password: string): Promise<boolean> => {
    // Mock signup logic
    if (email && username && password) {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUserData = {
        isAuthenticated: true,
        username,
        email,
        tier: 'free' as UserTier
      };
      
      setUserAuth(mockUserData);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUserAuth(defaultUserAuth);
  };

  const updateUserTier = (tier: UserTier) => {
    setUserAuth(prev => ({ ...prev, tier }));
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        userAuth,
        login,
        signup,
        logout,
        updateUserTier
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
