import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppTheme } from '../types';

interface ThemeContextType {
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  toggleTheme: () => void;
  isYellowRed: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'standard',
  setTheme: () => {},
  toggleTheme: () => {},
  isYellowRed: false,
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<AppTheme>(() => {
    const saved = localStorage.getItem('kisan_app_theme');
    return (saved === 'yellow-red' ? 'yellow-red' : 'standard') as AppTheme;
  });

  const setTheme = (newTheme: AppTheme) => {
    setThemeState(newTheme);
    localStorage.setItem('kisan_app_theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    if (newTheme === 'yellow-red') {
      document.body.classList.add('theme-yellow-red');
    } else {
      document.body.classList.remove('theme-yellow-red');
    }
  };

  const toggleTheme = () => {
    const next: AppTheme = theme === 'standard' ? 'yellow-red' : 'standard';
    setTheme(next);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'yellow-red') {
      document.body.classList.add('theme-yellow-red');
    } else {
      document.body.classList.remove('theme-yellow-red');
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, isYellowRed: theme === 'yellow-red' }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useAppTheme = () => useContext(ThemeContext);
