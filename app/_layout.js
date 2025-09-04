// app/_layout.js
import { Stack } from 'expo-router';
import React from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { ThemeProvider, useThemeContext } from '../context/ThemeContext'; // Import your custom ThemeProvider

// Define a RootLayout component that uses your custom ThemeProvider
function RootLayoutContent() {
  const { theme } = useThemeContext(); // Get the current theme from your context

  // Map your custom theme ('light' or 'dark') to react-navigation's themes
  const navigationTheme = theme === 'dark' ? DarkTheme : DefaultTheme;

  return (
    <NavigationThemeProvider value={navigationTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ headerShown: false }} />
        <Stack.Screen name="dashboard" options={{ headerShown: false }} />
        <Stack.Screen name="self-assessment" options={{ headerShown: true, title: 'Self-Assessment' }} />
        <Stack.Screen name="doctors-list" options={{ headerShown: true, title: 'Local Doctors' }} />
      </Stack>
    </NavigationThemeProvider>
  );
}

// Export a wrapper that provides the ThemeContext
export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootLayoutContent />
    </ThemeProvider>
  );
}