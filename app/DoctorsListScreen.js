import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Linking // For dialing mobile numbers
  ,


  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { app } from './firebaseConfig';

const db = getFirestore(app); // Get Firestore instance

// Helper function to calculate distance between two points using Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of Earth in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers
  return distance;
};

const DoctorListScreen = () => {
  const navigation = useNavigation();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // --- DoctorCard Component (re-usable for cleaner code) ---
  const DoctorCard = ({ doctor }) => (
    <View style={styles.doctorCard}>
      <Text style={styles.doctorName}>{doctor.name}</Text>
      <Text style={styles.doctorLocation}>
        {doctor.displayLocation || 'Location unavailable'}
      </Text>
      {doctor.distance !== undefined && (
        <Text style={styles.doctorDistance}>
          {doctor.distance < 1
            ? '< 1 km away'
            : `${doctor.distance.toFixed(2)} km away`}
        </Text>
      )}
      <TouchableOpacity
        style={styles.connectButton}
        onPress={() => {
          if (doctor.mobile) {
            Linking.openURL(`tel:${doctor.mobile}`);
          } else {
            Alert.alert('No Mobile Number', 'This doctor does not have a registered mobile number.');
          }
        }}
      >
        <Text style={styles.connectButtonText}>Call Doctor</Text>
      </TouchableOpacity>
      {/* You can add more details or navigation to DoctorDetailsScreen here */}
    </View>
  );

  // --- Request Location Permission ---
  const requestLocationPermission = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Denied',
        'Permission to access location was denied. Please enable it in your device settings to find local doctors.'
      );
      setPermissionGranted(false);
      setErrorMessage('Location permission denied.');
      return false;
    }
    setPermissionGranted(true);
    setErrorMessage('');
    return true;
  };

  // --- Get User Location ---
  const getUserCurrentLocation = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        setLoading(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeInterval: 1000,
        distanceInterval: 1,
      });
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      setLoading(false);
      Alert.alert('Location Acquired', 'Successfully got your current location!');
      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
    } catch (error) {
      console.error('Error getting location:', error);
      setErrorMessage('Could not get your location. Please try again.');
      setLoading(false);
      Alert.alert(
        'Location Error',
        'Could not retrieve your location. Make sure GPS is enabled.'
      );
      return null;
    }
  };

  // --- Fetch Doctors from Firestore and Filter by Distance ---
  const fetchLocalDoctors = async (currentLocation) => {
    if (!currentLocation) {
      setErrorMessage('User location not available.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setErrorMessage('');
    try {
      const doctorsCol = collection(db, 'doctors');
      const doctorSnapshot = await getDocs(doctorsCol);
      const allDoctors = doctorSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const radiusKm = 10; // Search radius in kilometers (e.g., 10 km)
      const nearbyDoctors = allDoctors
        .map((doctor) => {
          if (doctor.location && doctor.location.latitude && doctor.location.longitude) {
            const dist = calculateDistance(
              currentLocation.latitude,
              currentLocation.longitude,
              doctor.location.latitude,
              doctor.location.longitude
            );
            return { ...doctor, distance: dist };
          }
          return { ...doctor, distance: Infinity }; // Exclude doctors without valid location
        })
        .filter((doctor) => doctor.distance <= radiusKm)
        .sort((a, b) => a.distance - b.distance); // Sort by closest

      setDoctors(nearbyDoctors);
      setLoading(false);
      if (nearbyDoctors.length === 0) {
        Alert.alert('No Doctors Found', `No doctors found within ${radiusKm} km of your location.`);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setErrorMessage('Failed to fetch doctors from the database.');
      setLoading(false);
      Alert.alert('Data Error', 'Could not fetch doctor data. Please try again later.');
    }
  };

  // --- Handle "Connect to Local Doctors" button press ---
  const handleConnectToLocalDoctors = async () => {
    const loc = await getUserCurrentLocation();
    if (loc) {
      fetchLocalDoctors(loc);
    }
  };

  // Initial load check for permissions (optional, can be moved to button press)
  useEffect(() => {
    // You might want to pre-check permissions here or only on button press
    // requestLocationPermission(); // Uncomment if you want to ask on component mount
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Find Local Doctors</Text>

      <TouchableOpacity
        style={styles.actionButton}
        onPress={handleConnectToLocalDoctors}
        disabled={loading}
      >
        <Text style={styles.actionButtonText}>
          {loading ? 'Finding Doctors...' : 'Connect to Local Doctors'}
        </Text>
      </TouchableOpacity>

      {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}

      {loading && <ActivityIndicator size="large" color="#007bff" style={styles.loader} />}

      {doctors.length > 0 ? (
        <FlatList
          data={doctors}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <DoctorCard doctor={item} />}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        !loading && !errorMessage && (
          <Text style={styles.noDoctorsText}>
            Press "Connect to Local Doctors" to find specialists near you.
          </Text>
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
    paddingTop: 50, // To avoid status bar overlap
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  actionButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 3,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  errorMessage: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 14,
  },
  loader: {
    marginTop: 20,
  },
  listContent: {
    paddingBottom: 20,
  },
  doctorCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  doctorName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  doctorLocation: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  doctorDistance: {
    fontSize: 15,
    color: '#007bff',
    fontStyle: 'italic',
    marginBottom: 10,
  },
  connectButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  connectButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  noDoctorsText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 30,
  },
});

export default DoctorListScreen;