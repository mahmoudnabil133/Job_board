// src/context/ThemeContext.jsx
import React, { createContext, useEffect, useState } from 'react';

export const ThemeContext = createContext({
  dark: false,
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  const [dark, setDark] = useState(() => {
    // Load saved preference
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  const toggleTheme = () => setDark((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ dark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
