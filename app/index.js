// app/index.js (This replaces your screens/LandingPage.js)
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { router } from 'expo-router'; // Import router from expo-router
import { useTheme } from '@react-navigation/native'; // For theme colors

// Assume your logo is in assets/logo.png
const logo = require('../assets/logo.png');

const LandingPage = () => {
  const { colors } = useTheme(); // Access theme colors
  const [loadingMessage, setLoadingMessage] = useState("Loading your health journey...");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingMessage("Almost there...");
    }, 1500);

    const redirectTimer = setTimeout(() => {
      setIsLoading(false);
      router.replace('/LoginScreen'); // Redirect to Login after loading using Expo Router
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearTimeout(redirectTimer);
    };
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Image source={logo} style={styles.logo} />
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.text }]}>{loadingMessage}</Text>
        </View>
      )}
      {!isLoading && (
        <Text style={[styles.welcomeText, { color: colors.text }]}>Welcome to LungGuard!</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  loadingContainer: {
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
  }
});

export default LandingPage;