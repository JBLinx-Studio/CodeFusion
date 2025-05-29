
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

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

const SettingsContext = createContext<SettingsContextProps | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<EditorSettings>(defaultSettings);
  const { authState } = useAuth();
  
  // Load settings from localStorage, considering the user
  useEffect(() => {
    const loadSettings = () => {
      try {
        // If user is logged in, we use their personal settings key
        const storageKey = authState.user 
          ? `codeplayground-settings-${authState.user.id}` 
          : 'codeplayground-settings';
        
        const savedSettings = localStorage.getItem(storageKey);
        
        if (savedSettings) {
          setSettings(JSON.parse(savedSettings));
        }
      } catch (e) {
        console.error('Failed to load settings:', e);
      }
    };
    
    loadSettings();
  }, [authState.user]);

  // Save to localStorage when settings change, considering the user
  useEffect(() => {
    // Skip initial save on component mount
    if (settings === defaultSettings) return;
    
    // If user is logged in, we use their personal settings key
    const storageKey = authState.user 
      ? `codeplayground-settings-${authState.user.id}` 
      : 'codeplayground-settings';
    
    localStorage.setItem(storageKey, JSON.stringify(settings));
  }, [settings, authState.user]);

  const updateSettings = (newSettings: Partial<EditorSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings
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
