// context/ThemeContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // For persisting theme

// Install AsyncStorage: npx expo install @react-native-async-storage/async-storage

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme(); // 'dark' or 'light'
  const [theme, setTheme] = useState(systemColorScheme); // Initial theme is system default

  useEffect(() => {
    // Load saved theme preference on app start
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('appTheme');
        if (savedTheme) {
          setTheme(savedTheme);
        } else {
          setTheme(systemColorScheme); // If no saved theme, use system default
        }
      } catch (e) {
        console.error("Failed to load theme preference", e);
        setTheme(systemColorScheme); // Fallback to system default
      }
    };
    loadTheme();
  }, [systemColorScheme]); // Re-evaluate if systemColorScheme changes (e.g., user changes system setting)

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    try {
      await AsyncStorage.setItem('appTheme', newTheme);
    } catch (e) {
      console.error("Failed to save theme preference", e);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  return useContext(ThemeContext);
};