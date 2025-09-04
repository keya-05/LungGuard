// app/login.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { router } from 'expo-router'; // Use router from expo-router
import { useTheme } from '@react-navigation/native'; // For theme colors

const logo = require('../assets/logo.png'); // Your logo

const LoginScreen = () => {
  const { colors } = useTheme(); // Access theme colors
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    router.replace('/DashboardScreen');
    // if (username === 'test' && password === 'password') {
    //   router.replace('/DashboardScreen'); // Navigate to dashboard using Expo Router
    // } else {
    //   Alert.alert('Login Failed', 'Invalid username or password');
    // }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Image source={logo} style={styles.logo} />
      <Text style={[styles.title, { color: colors.text }]}>Login</Text>
      <TextInput
        style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
        placeholder="Username"
        placeholderTextColor={colors.text + '80'} // Semi-transparent text color
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
        placeholder="Password"
        placeholderTextColor={colors.text + '80'}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.navigate('/SignUpScreen')}> {/* Navigate to signup */}
        <Text style={[styles.signUpText, { color: colors.primary }]}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
  },
  button: {
    width: '100%',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signUpText: {
    marginTop: 20,
    fontSize: 16,
  },
});

export default LoginScreen;