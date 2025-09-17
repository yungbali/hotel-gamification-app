import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, Card, Title, Paragraph, Button, TextInput } from 'react-native-paper';
import { motion } from '../../utils/motion';
import { QRCodeService } from '../../services/qrCodeService';
import { FeedbackService } from '../../services/feedbackService';

interface GuestFeedbackFormProps {
  qrToken: string;
  onSubmissionComplete: () => void;
}

const GuestFeedbackForm: React.FC<GuestFeedbackFormProps> = ({ qrToken, onSubmissionComplete }) => {
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [lastName, setLastName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    validateQRCode();
  }, [qrToken]);

  const validateQRCode = async () => {
    try {
      const qrCodeService = QRCodeService.getInstance();
      const validation = await qrCodeService.validateQRCode(qrToken);
      
      if (validation.isValid && validation.qrCode) {
        setIsValid(true);
      } else {
        setIsValid(false);
      }
    } catch (error) {
      console.error('QR validation error:', error);
      setIsValid(false);
    } finally {
      setIsValidating(false);
    }
  };

  const handleSubmit = async () => {
    if (rating === null) {
      Alert.alert('Error', 'Please select a rating');
      return;
    }

    setIsSubmitting(true);
    try {
      const feedbackService = FeedbackService.getInstance();
      const result = await feedbackService.submitFeedback({
        token: qrToken,
        rating,
        comment: comment || undefined,
        tableNumber: tableNumber || undefined,
        lastName: lastName || undefined,
        timestamp: new Date().toISOString(),
        deviceInfo: {
          userAgent: 'mobile-guest',
          ip: 'local-demo',
        },
      });

      if (!result.success) {
        Alert.alert('Error', result.message || 'Failed to submit feedback. Please try again.');
        return;
      }

      onSubmissionComplete();
    } catch (error) {
      Alert.alert('Error', 'Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRatingSelect = (selectedRating: number) => {
    setRating(selectedRating);
  };

  if (isValidating) {
    return (
      <View style={styles.container}>
        <Card style={styles.card}>
          <Card.Content style={styles.loadingContent}>
            <Text>Validating QR code...</Text>
          </Card.Content>
        </Card>
      </View>
    );
  }

  if (!isValid) {
    return (
      <View style={styles.container}>
        <Card style={styles.card}>
          <Card.Content style={styles.errorContent}>
            <Title style={styles.errorTitle}>Invalid QR Code</Title>
            <Paragraph style={styles.errorText}>
              This QR code is invalid or has already been used. Please contact your server for a fresh code.
            </Paragraph>
          </Card.Content>
        </Card>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card style={styles.card}>
          <Card.Content style={styles.content}>
            <Title style={styles.title}>Rate Your Service</Title>
            <Paragraph style={styles.subtitle}>
              Help us improve by rating your dining experience
            </Paragraph>

            <View style={styles.ratingSection}>
              <Text style={styles.sectionTitle}>How was your service?</Text>
              <View style={styles.ratingContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.div
                    key={star}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: star * 0.1 }}
                  >
                    <Button
                      mode={rating === star ? "contained" : "outlined"}
                      onPress={() => handleRatingSelect(star)}
                      style={[
                        styles.ratingButton,
                        rating === star && styles.selectedRating
                      ]}
                      contentStyle={styles.ratingButtonContent}
                    >
                      ⭐ {star}
                    </Button>
                  </motion.div>
                ))}
              </View>
            </View>

            {rating && rating <= 3 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
              >
                <View style={styles.managerContactSection}>
                  <Text style={styles.managerContactTitle}>
                    We'd like to make this right
                  </Text>
                  <Text style={styles.managerContactText}>
                    A manager will contact you shortly to address your concerns.
                  </Text>
                </View>
              </motion.div>
            )}

            <View style={styles.commentSection}>
              <Text style={styles.sectionTitle}>Additional Comments (Optional)</Text>
              <TextInput
                value={comment}
                onChangeText={setComment}
                mode="outlined"
                multiline
                numberOfLines={3}
                placeholder="Share any additional feedback..."
                style={styles.commentInput}
              />
            </View>

            <View style={styles.verificationSection}>
              <Text style={styles.sectionTitle}>Verification (Optional)</Text>
              <TextInput
                value={tableNumber}
                onChangeText={setTableNumber}
                mode="outlined"
                label="Table Number"
                style={styles.verificationInput}
              />
              <TextInput
                value={lastName}
                onChangeText={setLastName}
                mode="outlined"
                label="Last Name"
                style={styles.verificationInput}
              />
            </View>

            <Button
              mode="contained"
              onPress={handleSubmit}
              loading={isSubmitting}
              disabled={isSubmitting || rating === null}
              style={styles.submitButton}
              contentStyle={styles.submitButtonContent}
            >
              Submit Feedback
            </Button>

            <Text style={styles.privacyText}>
              Your feedback is anonymous and will help improve our service quality.
            </Text>
          </Card.Content>
        </Card>
      </motion.div>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    justifyContent: 'center',
  },
  card: {
    borderRadius: 12,
    elevation: 4,
  },
  loadingContent: {
    alignItems: 'center',
    padding: 40,
  },
  errorContent: {
    alignItems: 'center',
    padding: 40,
  },
  errorTitle: {
    color: '#f44336',
    textAlign: 'center',
    marginBottom: 12,
  },
  errorText: {
    textAlign: 'center',
    color: '#666',
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#2196F3',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 24,
    color: '#666',
  },
  ratingSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  ratingButton: {
    flex: 1,
    borderRadius: 8,
  },
  selectedRating: {
    backgroundColor: '#2196F3',
  },
  ratingButtonContent: {
    paddingVertical: 8,
  },
  managerContactSection: {
    backgroundColor: '#FFF3E0',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  managerContactTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF9800',
    marginBottom: 4,
  },
  managerContactText: {
    fontSize: 14,
    color: '#666',
  },
  commentSection: {
    marginBottom: 24,
  },
  commentInput: {
    marginTop: 8,
  },
  verificationSection: {
    marginBottom: 24,
  },
  verificationInput: {
    marginTop: 8,
  },
  submitButton: {
    borderRadius: 8,
    marginBottom: 16,
  },
  submitButtonContent: {
    paddingVertical: 8,
  },
  privacyText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});

export default GuestFeedbackForm;
