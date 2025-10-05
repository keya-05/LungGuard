// app/dashboard.js
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Dimensions, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FindDoctorScreen from '../components/FindDoctorScreen';
import { useThemeContext } from '../context/ThemeContext';
// ✅ Import the custom colored chart
import { ColoredLineChart, getLegendItems } from './configChart';

const DashboardScreen = () => {
  const { colors } = useTheme();
  const { theme: currentTheme, toggleTheme } = useThemeContext();

  const [isMenuVisible, setMenuVisible] = useState(false);
  const [showFindDoctor, setShowFindDoctor] = useState(false);
  const [assessmentData, setAssessmentData] = useState([
    { date: 'Jan', score: 22 },
    { date: 'Feb', score: 12 },
    { date: 'Mar', score: 24 },
    { date: 'Apr', score: 26 },
    { date: 'May', score: 25 },
  ]);

  useEffect(() => {
    // You could fetch real assessment data here
  }, []);

  const handleMenuPress = (item) => {
    setMenuVisible(false);
    Alert.alert("Menu Item Clicked", `You clicked: ${item}`);
    if (item === 'Logout') {
      router.replace('/login');
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.welcomeText, { color: colors.text }]}>Welcome Back!</Text>
        <View style={styles.rightIconsContainer}>
          <TouchableOpacity
            style={[styles.themeToggleBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={toggleTheme}
          >
            <Ionicons
              name={currentTheme === 'dark' ? "moon" : "sunny"}
              size={24}
              color={currentTheme === 'dark' ? "#f5dd4b" : "#ffa500"}
            />
          </TouchableOpacity>

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
          onPressOut={() => setMenuVisible(false)}
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
              <Ionicons name="log-out-outline" size={24} color={colors.notification} />
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
          <Text style={[styles.featureButtonText, { color: colors.text }]}>Connect to Local Doctors</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.featureButton, styles.findDoctorButton, { backgroundColor: colors.card }]}
          onPress={() => setShowFindDoctor(true)}
        >
          <Ionicons name="location" size={30} color="#2196F3" />
          <Text style={[styles.featureButtonText, { color: colors.text }]}>Find Nearby Doctors</Text>
          <Text style={[styles.featureSubtext, { color: colors.text }]}>📍 Based on your location</Text>
        </TouchableOpacity>
      </View>

      {/* Lung Condition Graph */}
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Your Lung Condition Progress</Text>
      
      {/* ✅ Legend */}
      <View style={styles.legendContainer}>
        {getLegendItems().map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: item.color }]} />
            <Text style={[styles.legendText, { color: colors.text }]}>{item.label}</Text>
          </View>
        ))}
      </View>

      {assessmentData.length > 0 ? (
        <View style={[styles.chartContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {/* ✅ Custom Colored Line Chart */}
          <ColoredLineChart
            data={assessmentData}
            width={Dimensions.get('window').width - 40}
            height={220}
            colors={colors}
          />
        </View>
      ) : (
        <Text style={{ color: colors.text, textAlign: 'center', marginTop: 20 }}>
          No assessment data available yet.
        </Text>
      )}

      {/* Find Doctor Modal */}
      <Modal
        visible={showFindDoctor}
        animationType="slide"
        onRequestClose={() => setShowFindDoctor(false)}
      >
        <FindDoctorScreen />
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => setShowFindDoctor(false)}
        >
          <Ionicons name="close" size={24} color="#333" />
        </TouchableOpacity>
      </Modal>
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
    width: 44,
    height: 44,
    borderRadius: 22,
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
  findDoctorButton: {
    width: '100%',
  },
  featureSubtext: {
    marginTop: 5,
    fontSize: 12,
    opacity: 0.7,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
    paddingHorizontal: 10,
    flexWrap: 'wrap',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 6,
  },
  legendText: {
    fontSize: 11,
    fontWeight: '500',
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
    overflow: 'hidden',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 60,
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
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: '#fff',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default DashboardScreen;