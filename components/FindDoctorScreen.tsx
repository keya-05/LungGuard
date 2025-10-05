import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';

// Interface for Doctor data
interface Doctor {
  id: string;
  name: string;
  specialization: string;
  hospital: string;
  address: string;
  phone: string;
  distance: number; // in km
  latitude: number;
  longitude: number;
  rating: number;
  experience: number; // years
}

// Dummy doctor data - Replace this with your database API call
const DUMMY_DOCTORS: Omit<Doctor, 'distance'>[] = [
  {
    id: '1',
    name: 'Dr. Rajesh Kumar',
    specialization: 'Pulmonologist',
    hospital: 'City Hospital',
    address: 'Koregaon Park, Pune, Maharashtra',
    phone: '+91 9876543210',
    latitude: 18.5362,
    longitude: 73.8958,
    rating: 4.8,
    experience: 15,
  },
  {
    id: '2',
    name: 'Dr. Priya Sharma',
    specialization: 'Respiratory Medicine',
    hospital: 'Apollo Clinic',
    address: 'Baner, Pune, Maharashtra',
    phone: '+91 9876543211',
    latitude: 18.5591,
    longitude: 73.7781,
    rating: 4.6,
    experience: 12,
  },
  {
    id: '3',
    name: 'Dr. Amit Deshmukh',
    specialization: 'Pulmonologist',
    hospital: 'Ruby Hall Clinic',
    address: 'Hinjawadi, Pune, Maharashtra',
    phone: '+91 9876543212',
    latitude: 18.5907,
    longitude: 73.7385,
    rating: 4.9,
    experience: 20,
  },
  {
    id: '4',
    name: 'Dr. Sneha Patil',
    specialization: 'Chest Physician',
    hospital: 'Sahyadri Hospital',
    address: 'Kharadi, Pune, Maharashtra',
    phone: '+91 9876543213',
    latitude: 18.5515,
    longitude: 73.9367,
    rating: 4.7,
    experience: 10,
  },
  {
    id: '5',
    name: 'Dr. Vikram Mehta',
    specialization: 'Pulmonologist',
    hospital: 'Deenanath Mangeshkar Hospital',
    address: 'Erandwane, Pune, Maharashtra',
    phone: '+91 9876543214',
    latitude: 18.5089,
    longitude: 73.8384,
    rating: 4.8,
    experience: 18,
  },
];

const FindDoctorScreen = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Calculate distance between two coordinates using Haversine formula
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371; // Radius of the Earth in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return Math.round(distance * 10) / 10; // Round to 1 decimal place
  };

  // Request location permission and get current location
  const getLocation = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);

      // Request foreground location permission (only when in use)
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        Alert.alert(
          'Location Permission Required',
          'Please enable location access to find nearby doctors.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
          ]
        );
        setLoading(false);
        return;
      }

      // Get current location
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setLocation(currentLocation);

      // Calculate distances and sort doctors
      const doctorsWithDistance = DUMMY_DOCTORS.map((doctor) => ({
        ...doctor,
        distance: calculateDistance(
          currentLocation.coords.latitude,
          currentLocation.coords.longitude,
          doctor.latitude,
          doctor.longitude
        ),
      })).sort((a, b) => a.distance - b.distance);

      setDoctors(doctorsWithDistance);
      setLoading(false);
    } catch (error) {
      console.error('Error getting location:', error);
      setErrorMsg('Failed to get your location. Please try again.');
      setLoading(false);
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  // Open phone dialer
  const handleCall = (phone: string) => {
    const phoneNumber = Platform.OS === 'ios' ? `telprompt:${phone}` : `tel:${phone}`;
    Linking.openURL(phoneNumber).catch((err) =>
      Alert.alert('Error', 'Unable to make a call')
    );
  };

  // Open maps with directions
  const handleGetDirections = (latitude: number, longitude: number, name: string) => {
    const scheme = Platform.select({
      ios: 'maps:0,0?q=',
      android: 'geo:0,0?q=',
    });
    const latLng = `${latitude},${longitude}`;
    const label = name;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });

    if (url) {
      Linking.openURL(url).catch((err) =>
        Alert.alert('Error', 'Unable to open maps')
      );
    }
  };

  // Render doctor card
  const renderDoctorCard = ({ item }: { item: Doctor }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.doctorInfo}>
          <Text style={styles.doctorName}>{item.name}</Text>
          <Text style={styles.specialization}>{item.specialization}</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.rating}>{item.rating}</Text>
            <Text style={styles.experience}> • {item.experience} yrs exp</Text>
          </View>
        </View>
        <View style={styles.distanceContainer}>
          <Ionicons name="location" size={20} color="#2196F3" />
          <Text style={styles.distance}>{item.distance} km</Text>
        </View>
      </View>

      <View style={styles.hospitalInfo}>
        <Ionicons name="business" size={16} color="#666" />
        <Text style={styles.hospital}>{item.hospital}</Text>
      </View>

      <View style={styles.addressInfo}>
        <Ionicons name="location-outline" size={16} color="#666" />
        <Text style={styles.address}>{item.address}</Text>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.button, styles.callButton]}
          onPress={() => handleCall(item.phone)}
        >
          <Ionicons name="call" size={18} color="#fff" />
          <Text style={styles.buttonText}>Call</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.directionsButton]}
          onPress={() => handleGetDirections(item.latitude, item.longitude, item.name)}
        >
          <Ionicons name="navigate" size={18} color="#fff" />
          <Text style={styles.buttonText}>Directions</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Finding doctors near you...</Text>
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="alert-circle" size={64} color="#FF6B6B" />
        <Text style={styles.errorText}>{errorMsg}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={getLocation}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="medkit" size={32} color="#2196F3" />
        <Text style={styles.headerTitle}>Find Nearby Doctors</Text>
        {location && (
          <Text style={styles.locationText}>
            📍 Showing doctors near your location
          </Text>
        )}
      </View>

      <FlatList
        data={doctors}
        renderItem={renderDoctorCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="sad-outline" size={64} color="#999" />
            <Text style={styles.emptyText}>No doctors found nearby</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    padding: 20,
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 60,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  locationText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: '#2196F3',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  specialization: {
    fontSize: 14,
    color: '#2196F3',
    marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginLeft: 4,
  },
  experience: {
    fontSize: 14,
    color: '#666',
  },
  distanceContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  distance: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2196F3',
    marginTop: 4,
  },
  hospitalInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  hospital: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    flex: 1,
  },
  addressInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  address: {
    fontSize: 13,
    color: '#666',
    marginLeft: 8,
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  callButton: {
    backgroundColor: '#4CAF50',
  },
  directionsButton: {
    backgroundColor: '#2196F3',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#999',
  },
});

export default FindDoctorScreen;