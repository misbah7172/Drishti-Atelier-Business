import { useEffect } from 'react';
import { ThemeContext } from './ThemeContextInstance';

export function ThemeProvider({ children }) {
  const theme = 'light';

  useEffect(() => {
    try {
      localStorage.setItem('drishti-theme', theme);
    } catch {
      // Ignore storage errors
    }

    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    root.classList.remove('theme-dark');
    root.classList.add('theme-light');
  }, [theme]);

  const value = {
    theme,
    toggleTheme: () => {},
    setTheme: () => {},
    isDark: false,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

