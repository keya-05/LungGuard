// app/self-assessment.js
import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router'; // Import router
import { useTheme } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const SelfAssessmentScreen = () => {
  const { colors } = useTheme();
  const [timerRunning, setTimerRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0); // in seconds
  const intervalRef = useRef(null);

  const startTimer = () => {
    setElapsedTime(0);
    setTimerRunning(true);
    intervalRef.current = setInterval(() => {
      setElapsedTime(prevTime => prevTime + 1);
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(intervalRef.current);
    setTimerRunning(false);
    showResult(elapsedTime);
  };

  const showResult = (time) => {
    let message = '';
    let action = '';

    if (time > 25) {
      message = "You have good lungs!";
    } else if (time >= 20 && time <= 25) {
      message = "Decent lungs!";
    } else { // Below 20
      message = "Your lung capacity might need attention. Consider connecting with a doctor.";
      action = 'connect';
    }

    Alert.alert(
      "Assessment Result",
      `Your breath-holding time: ${time} seconds.\n\n${message}`,
      [
        { text: "OK", onPress: () => console.log("Result acknowledged") },
        action === 'connect' && {
          text: "Connect to Doctors",
          onPress: () => router.navigate('/DoctorsListScreen') // Navigate to doctors list
        }
      ].filter(Boolean)
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.instructions, { color: colors.text }]}>
        Instructions: Take a deep breath, hold it for as long as you can, and use the timer below to measure your time.
      </Text>

      <View style={[styles.timerDisplay, { backgroundColor: colors.card, borderColor: colors.primary }]}>
        <Text style={[styles.timerText, { color: colors.text }]}>
          {elapsedTime < 10 ? `0${elapsedTime}` : elapsedTime}s
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        {!timerRunning ? (
          <TouchableOpacity style={[styles.startButton, { backgroundColor: colors.primary }]} onPress={startTimer}>
            <Ionicons name="play" size={24} color="#fff" />
            <Text style={styles.buttonText}>Start Timer</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.stopButton} onPress={stopTimer}>
            <Ionicons name="stop" size={24} color="#fff" />
            <Text style={styles.buttonText}>Stop Timer</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    justifyContent: 'center',
  },
  instructions: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 25,
  },
  timerDisplay: {
    width: 180,
    height: 180,
    borderRadius: 90,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 50,
    borderWidth: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  timerText: {
    fontSize: 50,
    fontWeight: 'bold',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    width: '70%',
  },
  stopButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    backgroundColor: '#dc3545', // Red for stop - can also be dynamic from theme.colors
    width: '70%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default SelfAssessmentScreen;