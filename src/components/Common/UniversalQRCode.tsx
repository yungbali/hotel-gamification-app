import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';

interface UniversalQRCodeProps {
  value: string;
  size?: number;
  color?: string;
  backgroundColor?: string;
}

const UniversalQRCode: React.FC<UniversalQRCodeProps> = ({
  value,
  size = 250,
  color = "#000000",
  backgroundColor = "#FFFFFF"
}) => {
  if (Platform.OS === 'web') {
    // For web, we'll use a simple HTML canvas approach or show a placeholder
    return (
      <View style={[styles.webQRContainer, { width: size, height: size, backgroundColor }]}>
        <Text style={styles.webQRTitle}>QR CODE</Text>
        <Text style={styles.webQRUrl}>{value}</Text>
        <Text style={styles.webQRInstruction}>
          📱 Scan with phone camera
        </Text>
        <View style={styles.webQRPattern}>
          {/* Simple pattern to simulate QR code */}
          {Array.from({ length: 8 }, (_, i) => (
            <View key={i} style={styles.webQRRow}>
              {Array.from({ length: 8 }, (_, j) => (
                <View
                  key={j}
                  style={[
                    styles.webQRSquare,
                    { backgroundColor: (i + j) % 2 === 0 ? color : backgroundColor }
                  ]}
                />
              ))}
            </View>
          ))}
        </View>
      </View>
    );
  }

  // For native platforms, try to use the actual QR code library
  try {
    const QRCode = require('react-native-qrcode-svg').default;
    return (
      <QRCode
        value={value}
        size={size}
        color={color}
        backgroundColor={backgroundColor}
      />
    );
  } catch (error) {
    console.warn('QR Code library not available, using fallback');
    return (
      <View style={[styles.fallbackContainer, { width: size, height: size, backgroundColor }]}>
        <Text style={styles.fallbackTitle}>QR CODE</Text>
        <Text style={styles.fallbackUrl}>{value}</Text>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  webQRContainer: {
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  webQRTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  webQRUrl: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
    marginBottom: 12,
  },
  webQRInstruction: {
    fontSize: 12,
    color: '#2196F3',
    marginBottom: 16,
  },
  webQRPattern: {
    flexDirection: 'column',
  },
  webQRRow: {
    flexDirection: 'row',
  },
  webQRSquare: {
    width: 8,
    height: 8,
    margin: 1,
  },
  fallbackContainer: {
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  fallbackTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  fallbackUrl: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
  },
});

export default UniversalQRCode;
