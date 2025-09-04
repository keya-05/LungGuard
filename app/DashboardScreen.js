// app/dashboard.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Dimensions, Alert, Modal } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '@react-navigation/native'; // Keep this for colors
import { LineChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import { useThemeContext } from '../context/ThemeContext'; // Import your custom theme context

const DashboardScreen = () => {
  const { colors } = useTheme(); // Access colors from react-navigation's theme provider
  const { theme: currentTheme, toggleTheme } = useThemeContext(); // Get/set theme from your custom context

  const [isMenuVisible, setMenuVisible] = useState(false); // State for the settings menu
  const [assessmentData, setAssessmentData] = useState([
    { date: 'Jan', score: 22 },
    { date: 'Feb', score: 20 },
    { date: 'Mar', score: 24 },
    { date: 'Apr', score: 23 },
    { date: 'May', score: 25 },
  ]);

  useEffect(() => {
    // You could fetch real assessment data here
  }, []);

  const handleMenuPress = (item) => {
    setMenuVisible(false); // Close menu after selection
    Alert.alert("Menu Item Clicked", `You clicked: ${item}`);
    // Implement navigation or other actions based on 'item'
    if (item === 'Logout') {
      router.replace('/login'); // Example: Logout
    }
    // Add more conditions for Profile, Settings, Help etc.
  };

  const chartConfig = {
    backgroundGradientFrom: colors.card,
    backgroundGradientTo: colors.card,
    decimalPlaces: 0,
    color: (opacity = 1) => colors.primary,
    labelColor: (opacity = 1) => colors.text,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: colors.primary,
    },
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.welcomeText, { color: colors.text }]}>Welcome Back!</Text>
        <View style={styles.rightIconsContainer}>
          {/* Custom Toggle Button with Icon */}
          <TouchableOpacity
            style={[styles.themeToggleBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={toggleTheme}
          >
            <Ionicons
              name={currentTheme === 'dark' ? "moon" : "sunny"}
              size={24}
              color={currentTheme === 'dark' ? "#f5dd4b" : "#ffa500"} // Yellow moon, Orange sun
            />
          </TouchableOpacity>

          {/* Gear Icon */}
          <TouchableOpacity style={styles.gearIconContainer} onPress={() => setMenuVisible(true)}>
            <Ionicons name="settings-outline" size={28} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Settings/Profile Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isMenuVisible}
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setMenuVisible(false)} // Close when tapping outside
        >
          <View style={[styles.menuContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuPress('Profile')}>
              <Ionicons name="person-outline" size={24} color={colors.text} />
              <Text style={[styles.menuItemText, { color: colors.text }]}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuPress('Settings')}>
              <Ionicons name="options-outline" size={24} color={colors.text} />
              <Text style={[styles.menuItemText, { color: colors.text }]}>Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuPress('Help')}>
              <Ionicons name="help-circle-outline" size={24} color={colors.text} />
              <Text style={[styles.menuItemText, { color: colors.text }]}>Help</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuPress('Logout')}>
              <Ionicons name="log-out-outline" size={24} color={colors.notification} /> {/* Use notification for logout */}
              <Text style={[styles.menuItemText, { color: colors.notification }]}>Logout</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Feature Buttons */}
      <View style={styles.featuresGrid}>
        <TouchableOpacity
          style={[styles.featureButton, { backgroundColor: colors.card }]}
          onPress={() => router.navigate('/SelfAssessmentScreen')}
        >
          <Ionicons name="body-outline" size={30} color={colors.primary} />
          <Text style={[styles.featureButtonText, { color: colors.text }]}>Self-Assessment Test</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.featureButton, { backgroundColor: colors.card }]}
          onPress={() => router.navigate('/DoctorsListScreen')}
        >
          <Ionicons name="medkit-outline" size={30} color={colors.primary} />
          {/* COMMENT: Place your doctor button image here in assets/doctor_icon.png if you prefer */}
          {/* <Image source={require('../assets/doctor_icon.png')} style={styles.buttonIcon} /> */}
          <Text style={[styles.featureButtonText, { color: colors.text }]}>Connect to Local Doctors</Text>
        </TouchableOpacity>
      </View>

      {/* Lung Condition Graph */}
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Your Lung Condition Progress</Text>
      {assessmentData.length > 0 ? (
        <View style={[styles.chartContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <LineChart
            data={{
              labels: assessmentData.map(item => item.date),
              datasets: [{
                data: assessmentData.map(item => item.score)
              }]
            }}
            width={Dimensions.get('window').width - 40}
            height={220}
            yAxisLabel=""
            yAxisSuffix="s"
            yAxisInterval={1}
            chartConfig={chartConfig}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16
            }}
          />
        </View>
      ) : (
        <Text style={{ color: colors.text, textAlign: 'center', marginTop: 20 }}>No assessment data available yet.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 10,
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  rightIconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeToggleBtn: {
    width: 44, // Make it a square for the icon
    height: 44,
    borderRadius: 22, // Half of width/height for circle
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  gearIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  featureButton: {
    width: '48%',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureButtonText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  chartContainer: {
    borderRadius: 16,
    paddingVertical: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // Dim background
    justifyContent: 'flex-start', // Align to top right
    alignItems: 'flex-end',
    paddingTop: 60, // Adjust based on header height
    paddingRight: 20,
  },
  menuContainer: {
    borderRadius: 10,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    minWidth: 180,
    borderWidth: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 15,
    fontWeight: '500',
  },
});

export default DashboardScreen;