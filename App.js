// App.js
import React, { useState, useEffect } from 'react';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { useColorScheme } from 'react-native';
import AppNavigator from './navigation/AppNavigator';

export default function App() {
  const scheme = useColorScheme(); // 'dark' or 'light'

  // You can manage your theme state globally if needed, for simplicity we use useColorScheme
  const theme = scheme === 'dark' ? DarkTheme : DefaultTheme;

  return (
    <NavigationContainer theme={theme}>
      <AppNavigator />
    </NavigationContainer>
  );
}