import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, Card, Title, Paragraph, Button, Chip } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { motion } from '../utils/motion';
import UniversalQRCode from '../components/Common/UniversalQRCode';
import { AuthService } from '../services/authService';
import { QRCodeService } from '../services/qrCodeService';
import { getDataService } from '../services/dataService';
import { User, QRCode as QRCodeType, Shift } from '../types';

const QRCodeScreen: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [qrCode, setQrCode] = useState<QRCodeType | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [shift, setShift] = useState<Shift | null>(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const authService = AuthService.getInstance();
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      if (currentUser) {
        await loadExistingSession(currentUser.id);
      }
    } catch (error) {
      console.error('Load user error:', error);
    }
  };

  const loadExistingSession = async (waiterId: string) => {
    try {
      const storageService = getDataService();
      const qrCodeService = QRCodeService.getInstance();

      const activeShift = await storageService.getActiveShiftByWaiter(waiterId);
      setShift(activeShift);

      if (activeShift) {
        const activeCode = await qrCodeService.getActiveQRCode(waiterId);
        setQrCode(activeCode);
        setIsActive(activeShift.isActive && !!activeCode);
      } else {
        setQrCode(null);
        setIsActive(false);
      }
    } catch (error) {
      console.error('Load session error:', error);
      setIsActive(false);
    }
  };

  const handleStartShift = async () => {
    if (!user) return;
    if (isActive) {
      Alert.alert('Shift Active', 'End your current shift before generating a new QR code.');
      return;
    }

    setIsGenerating(true);
    try {
      const storageService = getDataService();
      const qrCodeService = QRCodeService.getInstance();

      const newShift: Shift = {
        id: `shift_${Date.now()}`,
        waiterId: user.id,
        startTime: new Date(),
        isActive: true,
        pointsEarned: 0,
        ratingsCount: 0,
        averageRating: 0,
      };

      await storageService.storeShift(newShift);
      console.log('Shift created:', newShift);
      
      const newQRCode = await qrCodeService.generateQRCode(user.id, newShift.id);
      console.log('QR Code generated:', newQRCode);

      setShift(newShift);
      setQrCode(newQRCode);
      setIsActive(true);
      
      Alert.alert('Success', `QR Code generated! URL: ${newQRCode.url}`);
    } catch (error) {
      console.error('Start shift error:', error);
      Alert.alert('Error', 'Failed to start shift');
    } finally {
      setIsGenerating(false);
    }
  };

  const startShift = async () => {
    Alert.alert(
      'Start Shift',
      'Are you ready to start your shift and begin collecting ratings?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Start Shift', onPress: handleStartShift },
      ]
    );
  };

  const endShift = () => {
    Alert.alert(
      'End Shift',
      'Are you sure you want to end your shift?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'End Shift', 
          onPress: async () => {
            try {
              const storageService = getDataService();
              const qrCodeService = QRCodeService.getInstance();

              if (qrCode) {
                await qrCodeService.markQRCodeAsUsed(qrCode.token);
              }

              if (shift) {
                await storageService.endShift(shift.id);
              }

              setQrCode(null);
              setIsActive(false);
              setShift(prev => prev ? { ...prev, isActive: false, endTime: new Date() } : prev);
            } catch (error) {
              console.error('End shift error:', error);
              Alert.alert('Error', 'Failed to close the shift');
            }
          }
        },
      ]
    );
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.headerTitle}>Your QR Code</Title>
        <Paragraph style={styles.headerSubtitle}>
          Show this to guests to collect ratings
        </Paragraph>
      </View>

      <View style={styles.content}>
        {!qrCode ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card style={styles.startShiftCard}>
              <Card.Content style={styles.startShiftContent}>
                <Ionicons name="play-circle" size={64} color="#2196F3" />
                <Title style={styles.startShiftTitle}>Ready to Start?</Title>
                <Paragraph style={styles.startShiftText}>
                  Generate your unique QR code to begin collecting guest feedback and earning points.
                </Paragraph>
                <Button
                  mode="contained"
                  onPress={startShift}
                  loading={isGenerating}
                  disabled={isGenerating}
                  style={styles.startButton}
                  contentStyle={styles.buttonContent}
                >
                  Start Shift
                </Button>
              </Card.Content>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card style={styles.qrCard}>
              <Card.Content style={styles.qrCardContent}>
                <View style={styles.qrContainer}>
                  <UniversalQRCode
                    value={qrCode.url}
                    size={250}
                    color="#000000"
                    backgroundColor="#FFFFFF"
                  />
                </View>
                
                <View style={styles.qrInfo}>
                  <Text style={styles.qrTitle}>Scan to Rate Service</Text>
                  <Paragraph style={styles.qrSubtitle}>
                    Share this QR code with your guests for instant feedback
                  </Paragraph>
                </View>

                <View style={styles.shiftInfo}>
                  <Chip icon="clock" style={styles.shiftChip}>
                    {isActive ? 'Shift Active' : 'Shift Paused'}
                  </Chip>
                  <Text style={styles.shiftTime}>
                    {shift?.startTime
                      ? `Started ${new Date(shift.startTime).toLocaleTimeString()}`
                      : 'Shift start time unavailable'}
                  </Text>
                  <Text style={styles.shiftMeta}>
                    Expires {qrCode?.expiresAt ? new Date(qrCode.expiresAt).toLocaleTimeString() : 'in 24 hours'}
                  </Text>
                </View>

                <View style={styles.instructionsContainer}>
                  <Text style={styles.instructionsTitle}>Instructions:</Text>
                  <View style={styles.instructionItem}>
                    <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                    <Text style={styles.instructionText}>Present QR code after serving</Text>
                  </View>
                  <View style={styles.instructionItem}>
                    <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                    <Text style={styles.instructionText}>Guests scan with phone camera</Text>
                  </View>
                  <View style={styles.instructionItem}>
                    <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                    <Text style={styles.instructionText}>4-5 stars earn you points!</Text>
                  </View>
                </View>

                <Button
                  mode="outlined"
                  onPress={endShift}
                  style={styles.endButton}
                  contentStyle={styles.buttonContent}
                  icon="stop"
                >
                  End Shift
                </Button>
              </Card.Content>
            </Card>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Card style={styles.tipsCard}>
            <Card.Content>
              <Title style={styles.tipsTitle}>💡 Tips for Better Ratings</Title>
              <View style={styles.tipsList}>
                <Text style={styles.tipText}>• Smile and be friendly</Text>
                <Text style={styles.tipText}>• Check on guests regularly</Text>
                <Text style={styles.tipText}>• Be attentive to special requests</Text>
                <Text style={styles.tipText}>• Thank guests for their feedback</Text>
              </View>
            </Card.Content>
          </Card>
        </motion.div>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2196F3',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  startShiftCard: {
    borderRadius: 12,
    marginBottom: 20,
  },
  startShiftContent: {
    alignItems: 'center',
    padding: 32,
  },
  startShiftTitle: {
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  startShiftText: {
    textAlign: 'center',
    marginBottom: 24,
    color: '#666',
  },
  startButton: {
    borderRadius: 8,
  },
  qrCard: {
    borderRadius: 12,
    marginBottom: 20,
  },
  qrCardContent: {
    alignItems: 'center',
    padding: 24,
  },
  qrContainer: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  qrInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  qrTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  qrSubtitle: {
    textAlign: 'center',
    color: '#666',
  },
  shiftInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  shiftChip: {
    backgroundColor: '#E8F5E8',
    marginBottom: 8,
  },
  shiftTime: {
    fontSize: 12,
    color: '#666',
  },
  shiftMeta: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  instructionsContainer: {
    width: '100%',
    marginBottom: 20,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  instructionText: {
    marginLeft: 8,
    color: '#666',
  },
  endButton: {
    borderRadius: 8,
    borderColor: '#f44336',
  },
  tipsCard: {
    borderRadius: 12,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  tipsList: {
    gap: 8,
  },
  tipText: {
    color: '#666',
    fontSize: 14,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  qrUrlText: {
    fontSize: 12,
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
  },
});

export default QRCodeScreen;
