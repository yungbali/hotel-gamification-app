import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

// Try different QR code approaches
const TestQRCode: React.FC = () => {
  const [qrValue, setQrValue] = React.useState<string>('');
  const [error, setError] = React.useState<string>('');

  const generateTestQR = async () => {
    try {
      setError('');
      const testUrl = 'https://yungbali.github.io/hotel-gamification-app/feedback/test123';
      setQrValue(testUrl);
      console.log('Generated QR URL:', testUrl);
    } catch (err) {
      console.error('QR generation error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>QR Code Test</Text>
      
      <Button mode="contained" onPress={generateTestQR} style={styles.button}>
        Generate Test QR Code
      </Button>
      
      {error && (
        <Text style={styles.error}>Error: {error}</Text>
      )}
      
      {qrValue && (
        <View style={styles.qrContainer}>
          <Text style={styles.label}>QR Value:</Text>
          <Text style={styles.value}>{qrValue}</Text>
          
          {/* Simple QR Code representation for web */}
          <View style={styles.qrPlaceholder}>
            <Text style={styles.qrText}>QR CODE</Text>
            <Text style={styles.qrUrl}>{qrValue}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    marginBottom: 20,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  qrContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  value: {
    fontSize: 12,
    color: '#666',
    marginBottom: 20,
  },
  qrPlaceholder: {
    width: 200,
    height: 200,
    backgroundColor: '#f0f0f0',
    borderWidth: 2,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  qrText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  qrUrl: {
    fontSize: 10,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
});

export default TestQRCode;
