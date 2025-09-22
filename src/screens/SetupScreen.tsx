import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Card, Title, TextInput, Button, SegmentedButtons, Divider } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { motion } from '../utils/motion';
import { AmplifyAuthService } from '../services/amplifyAuthService';
import { AmplifyUserManagementService } from '../services/amplifyUserManagementService';
import { Hotel } from '../types';
import { shouldUseAmplify } from '../services/amplifyClient';

interface SetupScreenProps {
  onSetupComplete: () => void;
}

const SetupScreen: React.FC<SetupScreenProps> = ({ onSetupComplete }) => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  // Hotel setup
  const [hotelName, setHotelName] = useState('');
  const [hotelAddress, setHotelAddress] = useState('');
  
  // Supervisor setup
  const [supervisorName, setSupervisorName] = useState('');
  const [supervisorEmail, setSupervisorEmail] = useState('');
  const [supervisorPassword, setSupervisorPassword] = useState('');
  
  // Waiters setup
  const [waitersData, setWaitersData] = useState<Array<{name: string, email: string}>>([
    { name: '', email: '' },
    { name: '', email: '' },
    { name: '', email: '' },
    { name: '', email: '' },
    { name: '', email: '' },
  ]);

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateStep1 = (): boolean => {
    const newErrors: {[key: string]: string} = {};
    
    if (!hotelName.trim()) {
      newErrors.hotelName = 'Hotel name is required';
    }
    if (!hotelAddress.trim()) {
      newErrors.hotelAddress = 'Hotel address is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = async (): Promise<boolean> => {
    const newErrors: {[key: string]: string} = {};
    
    if (!supervisorName.trim()) {
      newErrors.supervisorName = 'Supervisor name is required';
    }
    if (!supervisorEmail.trim()) {
      newErrors.supervisorEmail = 'Supervisor email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(supervisorEmail.trim())) {
      newErrors.supervisorEmail = 'Please enter a valid email address';
    }
    if (!supervisorPassword.trim()) {
      newErrors.supervisorPassword = 'Password is required';
    } else if (supervisorPassword.length < 8) {
      newErrors.supervisorPassword = 'Password must be at least 8 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = (): boolean => {
    const newErrors: {[key: string]: string} = {};
    
    // Check that at least one waiter is provided
    const validWaiters = waitersData.filter(w => w.name.trim() && w.email.trim());
    if (validWaiters.length === 0) {
      newErrors.waiters = 'Please add at least one waiter';
    }
    
    // Validate individual waiter entries
    waitersData.forEach((waiter, index) => {
      if (waiter.name.trim() && !waiter.email.trim()) {
        newErrors[`waiter_email_${index}`] = 'Email is required';
      } else if (waiter.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(waiter.email.trim())) {
        newErrors[`waiter_email_${index}`] = 'Invalid email';
      }
      
      if (waiter.email.trim() && !waiter.name.trim()) {
        newErrors[`waiter_name_${index}`] = 'Name is required';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && await validateStep2()) {
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = async () => {
    if (!validateStep3()) return;

    setIsLoading(true);
    try {
      const authService = AmplifyAuthService.getInstance();
      const userManagementService = AmplifyUserManagementService.getInstance();

      // Create hotel first
      const hotel = await authService.createHotel({
        name: hotelName.trim(),
        address: hotelAddress.trim(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });

      // Setup supervisor account in Cognito
      await authService.setupSupervisor({
        email: supervisorEmail.trim().toLowerCase(),
        password: supervisorPassword,
        name: supervisorName.trim(),
        hotelId: hotel.id,
      });

      // Create supervisor record in DataStore
      const supervisor = await userManagementService.createSupervisorRecord({
        email: supervisorEmail.trim().toLowerCase(),
        name: supervisorName.trim(),
        hotelId: hotel.id,
      });

      // Setup waiters
      const validWaiters = waitersData.filter(w => w.name.trim() && w.email.trim());
      
      await authService.setupWaiters(
        validWaiters.map(w => ({
          email: w.email.trim().toLowerCase(),
          name: w.name.trim(),
          hotelId: hotel.id,
          supervisorId: supervisor.id,
        }))
      );

      // Create waiter records in DataStore
      for (const waiterData of validWaiters) {
        await userManagementService.createWaiterRecord({
          email: waiterData.email.trim().toLowerCase(),
          name: waiterData.name.trim(),
          hotelId: hotel.id,
          supervisorId: supervisor.id,
        });
      }

      Alert.alert(
        'Setup Complete!',
        `Your hotel "${hotelName}" has been set up with ${validWaiters.length} waiters under your supervision. 

⚠️ Important: Check your email to confirm your account before logging in.

Waiters will receive temporary passwords and should change them on first login.`,
        [
          {
            text: 'Continue to Login',
            onPress: onSetupComplete,
          },
        ]
      );
    } catch (error) {
      console.error('Setup error:', error);
      Alert.alert(
        'Setup Failed',
        error instanceof Error ? error.message : 'There was an error setting up your hotel. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const updateWaiterData = (index: number, field: 'name' | 'email', value: string) => {
    const newWaitersData = [...waitersData];
    newWaitersData[index][field] = value;
    setWaitersData(newWaitersData);
  };

  const addWaiterField = () => {
    if (waitersData.length < 12) {
      setWaitersData([...waitersData, { name: '', email: '' }]);
    }
  };

  const removeWaiterField = (index: number) => {
    if (waitersData.length > 1) {
      const newWaitersData = waitersData.filter((_, i) => i !== index);
      setWaitersData(newWaitersData);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card style={styles.card}>
            <Card.Content>
              <Title style={styles.title}>Hotel Setup Wizard</Title>
              <Text style={styles.subtitle}>Step {step} of 3</Text>
              
              <View style={styles.progressContainer}>
                <View style={[styles.progressBar, { width: `${(step / 3) * 100}%` }]} />
              </View>

              {step === 1 && (
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>🏨 Hotel Information</Text>
                  <Text style={styles.stepDescription}>
                    Let's start by setting up your hotel details.
                  </Text>

                  <TextInput
                    label="Hotel Name"
                    value={hotelName}
                    onChangeText={setHotelName}
                    style={styles.input}
                    error={!!errors.hotelName}
                    mode="outlined"
                    placeholder="Enter your hotel name"
                  />
                  {errors.hotelName && <Text style={styles.errorText}>{errors.hotelName}</Text>}

                  <TextInput
                    label="Hotel Address"
                    value={hotelAddress}
                    onChangeText={setHotelAddress}
                    style={styles.input}
                    error={!!errors.hotelAddress}
                    mode="outlined"
                    multiline
                    numberOfLines={3}
                    placeholder="Enter your hotel address"
                  />
                  {errors.hotelAddress && <Text style={styles.errorText}>{errors.hotelAddress}</Text>}
                </View>
              )}

              {step === 2 && (
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>👨‍💼 Supervisor Account</Text>
                  <Text style={styles.stepDescription}>
                    Create your supervisor account to manage your team.
                  </Text>

                  <TextInput
                    label="Your Full Name"
                    value={supervisorName}
                    onChangeText={setSupervisorName}
                    style={styles.input}
                    error={!!errors.supervisorName}
                    mode="outlined"
                    placeholder="Enter your full name"
                  />
                  {errors.supervisorName && <Text style={styles.errorText}>{errors.supervisorName}</Text>}

                  <TextInput
                    label="Email Address"
                    value={supervisorEmail}
                    onChangeText={setSupervisorEmail}
                    style={styles.input}
                    error={!!errors.supervisorEmail}
                    mode="outlined"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholder="Enter your email"
                  />
                  {errors.supervisorEmail && <Text style={styles.errorText}>{errors.supervisorEmail}</Text>}

                  <TextInput
                    label="Password"
                    value={supervisorPassword}
                    onChangeText={setSupervisorPassword}
                    style={styles.input}
                    error={!!errors.supervisorPassword}
                    mode="outlined"
                    secureTextEntry
                    placeholder="Create a password (min 6 characters)"
                  />
                  {errors.supervisorPassword && <Text style={styles.errorText}>{errors.supervisorPassword}</Text>}
                </View>
              )}

              {step === 3 && (
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>👥 Add Your Team</Text>
                  <Text style={styles.stepDescription}>
                    Add 5-12 waiters to your team. You can add more later.
                  </Text>

                  {errors.waiters && <Text style={styles.errorText}>{errors.waiters}</Text>}

                  {waitersData.map((waiter, index) => (
                    <View key={index} style={styles.waiterRow}>
                      <Text style={styles.waiterNumber}>#{index + 1}</Text>
                      <View style={styles.waiterInputs}>
                        <TextInput
                          label="Waiter Name"
                          value={waiter.name}
                          onChangeText={(value) => updateWaiterData(index, 'name', value)}
                          style={[styles.input, styles.waiterInput]}
                          error={!!errors[`waiter_name_${index}`]}
                          mode="outlined"
                          placeholder="Full name"
                        />
                        <TextInput
                          label="Email"
                          value={waiter.email}
                          onChangeText={(value) => updateWaiterData(index, 'email', value)}
                          style={[styles.input, styles.waiterInput]}
                          error={!!errors[`waiter_email_${index}`]}
                          mode="outlined"
                          keyboardType="email-address"
                          autoCapitalize="none"
                          placeholder="Email address"
                        />
                      </View>
                      {waitersData.length > 1 && (
                        <Button
                          onPress={() => removeWaiterField(index)}
                          mode="text"
                          compact
                        >
                          Remove
                        </Button>
                      )}
                    </View>
                  ))}

                  {waitersData.length < 12 && (
                    <Button
                      onPress={addWaiterField}
                      mode="outlined"
                      style={styles.addButton}
                      icon="plus"
                    >
                      Add Another Waiter
                    </Button>
                  )}
                </View>
              )}

              <View style={styles.buttonContainer}>
                {step > 1 && (
                  <Button
                    mode="outlined"
                    onPress={handleBack}
                    style={styles.backButton}
                    disabled={isLoading}
                  >
                    Back
                  </Button>
                )}
                
                {step < 3 ? (
                  <Button
                    mode="contained"
                    onPress={handleNext}
                    style={styles.nextButton}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    mode="contained"
                    onPress={handleComplete}
                    style={styles.nextButton}
                    loading={isLoading}
                    disabled={isLoading}
                  >
                    Complete Setup
                  </Button>
                )}
              </View>
            </Card.Content>
          </Card>
        </motion.div>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    elevation: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 24,
  },
  progressContainer: {
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    marginBottom: 32,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#6200ea',
    borderRadius: 2,
  },
  stepContent: {
    marginBottom: 32,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  stepDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
    lineHeight: 20,
  },
  input: {
    marginBottom: 8,
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 12,
    marginBottom: 16,
    marginLeft: 12,
  },
  waiterRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  waiterNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6200ea',
    marginRight: 12,
    marginTop: 12,
    minWidth: 24,
  },
  waiterInputs: {
    flex: 1,
  },
  waiterInput: {
    marginBottom: 8,
  },
  addButton: {
    marginTop: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backButton: {
    flex: 1,
    marginRight: 8,
  },
  nextButton: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: '#6200ea',
  },
});

export default SetupScreen;
