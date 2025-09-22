import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Card, Title, TextInput, Button, Avatar, Appbar } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { motion } from '../utils/motion';
import { AmplifyUserManagementService } from '../services/amplifyUserManagementService';
import { AmplifyAuthService } from '../services/amplifyAuthService';

interface AddWaiterScreenProps {
  navigation: any;
}

const AddWaiterScreen: React.FC<AddWaiterScreenProps> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateForm = async (): Promise<boolean> => {
    const newErrors: {[key: string]: string} = {};
    const userManagementService = AmplifyUserManagementService.getInstance();

    // Name validation
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Email validation
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    } else {
      // Check if email is unique
      const isUnique = await userManagementService.validateEmailUnique(email.trim());
      if (!isUnique) {
        newErrors.email = 'This email is already registered';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddWaiter = async () => {
    setIsLoading(true);
    
    try {
      const isValid = await validateForm();
      if (!isValid) {
        setIsLoading(false);
        return;
      }

      const authService = AmplifyAuthService.getInstance();
      const userManagementService = AmplifyUserManagementService.getInstance();
      
      const currentUser = await authService.getCurrentUser();
      if (!currentUser) {
        throw new Error('Not authenticated');
      }

      // Create the waiter record in DataStore
      const newWaiter = await userManagementService.createWaiterRecord({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        hotelId: currentUser.hotelId,
        supervisorId: currentUser.role === 'supervisor' ? currentUser.id : undefined,
      });

      // Setup waiter account in Cognito (with temporary password)
      await authService.setupWaiters([{
        email: email.trim().toLowerCase(),
        name: name.trim(),
        hotelId: currentUser.hotelId,
        supervisorId: currentUser.role === 'supervisor' ? currentUser.id : '',
      }]);

      Alert.alert(
        'Success!',
        `${newWaiter.name} has been added to your team.`,
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error('Add waiter error:', error);
      Alert.alert(
        'Error',
        'Failed to add waiter. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const generateInitials = (name: string): string => {
    return name.trim().split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Add New Waiter" />
      </Appbar.Header>

      <ScrollView style={styles.content}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card style={styles.formCard}>
            <Card.Content>
              <Title style={styles.title}>New Team Member</Title>
              
              {/* Avatar Preview */}
              <View style={styles.avatarContainer}>
                <Avatar.Text 
                  size={80} 
                  label={name ? generateInitials(name) : '?'}
                  style={styles.avatar}
                />
                <Text style={styles.avatarLabel}>Profile Preview</Text>
              </View>

              {/* Name Input */}
              <TextInput
                label="Full Name"
                value={name}
                onChangeText={setName}
                style={styles.input}
                error={!!errors.name}
                mode="outlined"
                left={<TextInput.Icon icon="account" />}
                placeholder="Enter waiter's full name"
              />
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

              {/* Email Input */}
              <TextInput
                label="Email Address"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                error={!!errors.email}
                mode="outlined"
                keyboardType="email-address"
                autoCapitalize="none"
                left={<TextInput.Icon icon="email" />}
                placeholder="Enter waiter's email"
              />
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

              {/* Information Card */}
              <Card style={styles.infoCard}>
                <Card.Content>
                  <View style={styles.infoRow}>
                    <Ionicons name="information-circle" size={20} color="#2196F3" />
                    <Text style={styles.infoText}>
                      The new waiter will be automatically assigned to your supervision and can start working immediately.
                    </Text>
                  </View>
                </Card.Content>
              </Card>

              {/* Default Settings Info */}
              <View style={styles.defaultSettings}>
                <Text style={styles.defaultSettingsTitle}>Default Settings:</Text>
                <Text style={styles.defaultSettingsText}>• Starting Level: 1</Text>
                <Text style={styles.defaultSettingsText}>• Starting Points: 0</Text>
                <Text style={styles.defaultSettingsText}>• Status: Active</Text>
                <Text style={styles.defaultSettingsText}>• Role: Waiter</Text>
              </View>

              {/* Action Buttons */}
              <View style={styles.buttonContainer}>
                <Button
                  mode="outlined"
                  onPress={() => navigation.goBack()}
                  style={styles.cancelButton}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  mode="contained"
                  onPress={handleAddWaiter}
                  style={styles.addButton}
                  loading={isLoading}
                  disabled={isLoading || !name.trim() || !email.trim()}
                >
                  Add Waiter
                </Button>
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
  formCard: {
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    color: '#333',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatar: {
    backgroundColor: '#6200ea',
    marginBottom: 8,
  },
  avatarLabel: {
    fontSize: 12,
    color: '#666',
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
  infoCard: {
    backgroundColor: '#e3f2fd',
    marginVertical: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#1976d2',
    lineHeight: 20,
  },
  defaultSettings: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    marginVertical: 16,
  },
  defaultSettingsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  defaultSettingsText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
  },
  addButton: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: '#6200ea',
  },
});

export default AddWaiterScreen;
