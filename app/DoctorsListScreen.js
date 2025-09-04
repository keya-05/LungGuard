// app/doctors-list.js
import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Linking, Image, Alert } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const doctors = [
  {
    id: '1',
    name: 'Dr. Emily Watson',
    specialization: 'Pulmonologist',
    phone: '+15551234567',
    address: '123 Main St, Anytown, USA',
    image: require('../assets/logo.png')
  },
  {
    id: '2',
    name: 'Dr. John Doe',
    specialization: 'Respiratory Therapist',
    phone: '+15559876543',
    address: '456 Oak Ave, Anytown, USA',
    image: require('../assets/logo.png')
  },
  {
    id: '3',
    name: 'Dr. Sarah Lee',
    specialization: 'General Practitioner',
    phone: '+15555551212',
    address: '789 Pine Ln, Anytown, USA',
    image: require('../assets/logo.png')
  },
  {
    id: '4',
    name: 'Dr. Michael Chen',
    specialization: 'Pulmonologist',
    phone: '+15557890123',
    address: '101 Elm Rd, Anytown, USA',
    image: require('../assets/logo.png')
  },
];

const DoctorsListScreen = () => {
  const { colors } = useTheme();

  const makeCall = (phoneNumber) => {
    Linking.openURL(`tel:${phoneNumber}`).catch(err => {
      console.error("Failed to open dialer:", err);
      Alert.alert("Error", "Could not open dialer. Please check if your device supports calling.");
    });
  };

  const openMaps = (address) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    Linking.openURL(url).catch(err => {
      console.error("Failed to open maps:", err);
      Alert.alert("Error", "Could not open maps. Please ensure you have a map application installed.");
    });
  };

  const renderDoctorItem = ({ item }) => (
    <View style={[styles.doctorCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Image
        source={item.image || require('../assets/logo.png')}
        style={styles.doctorImage}
      />
      <View style={styles.doctorInfo}>
        <Text style={[styles.doctorName, { color: colors.text }]}>{item.name}</Text>
        <Text style={[styles.doctorSpecialization, { color: colors.text }]}>{item.specialization}</Text>
        <Text style={[styles.doctorAddress, { color: colors.text }]}>{item.address}</Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.primary }]}
            onPress={() => makeCall(item.phone)}
          >
            <Ionicons name="call-outline" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Call</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.notification }]}
            onPress={() => openMaps(item.address)}
          >
            <Ionicons name="map-outline" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Directions</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.pageTitle, { color: colors.text }]}>Local Doctors Near You</Text>
      <FlatList
        data={doctors}
        keyExtractor={(item) => item.id}
        renderItem={renderDoctorItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={{ color: colors.text, textAlign: 'center', marginTop: 50 }}>
            No doctors found. Please check your location settings or try again later.
          </Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 15,
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: 20,
  },
  doctorCard: {
    flexDirection: 'row',
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
  },
  doctorImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
    borderWidth: 1,
    borderColor: '#eee',
    resizeMode: 'cover',
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  doctorSpecialization: {
    fontSize: 15,
    color: '#666',
    marginBottom: 5,
  },
  doctorAddress: {
    fontSize: 14,
    color: '#888',
    marginBottom: 10,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 10,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 5,
  },
});

export default DoctorsListScreen;