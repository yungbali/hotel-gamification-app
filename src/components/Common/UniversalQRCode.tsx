import React, { useEffect, useRef } from 'react';
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
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (Platform.OS === 'web' && canvasRef.current) {
      generateWebQRCode();
    }
  }, [value, size, color, backgroundColor]);

  const generateWebQRCode = async () => {
    if (!canvasRef.current) return;
    
    try {
      const QRCode = require('qrcode');
      await QRCode.toCanvas(canvasRef.current, value, {
        width: size,
        color: {
          dark: color,
          light: backgroundColor
        },
        margin: 2
      });
    } catch (error) {
      console.error('QR Code generation error:', error);
      // Fallback to showing the URL if QR generation fails
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, size, size);
        ctx.fillStyle = color;
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('QR CODE', size / 2, size / 2 - 20);
        ctx.font = '10px Arial';
        ctx.fillText(value, size / 2, size / 2);
        ctx.fillText('📱 Scan with phone camera', size / 2, size / 2 + 20);
      }
    }
  };

  if (Platform.OS === 'web') {
    return (
      <View style={[styles.webQRContainer, { width: size, height: size }]}>
        <canvas
          ref={canvasRef}
          width={size}
          height={size}
          style={{ maxWidth: '100%', height: 'auto' }}
        />
        <Text style={styles.webQRUrl}>{value}</Text>
        <Text style={styles.webQRInstruction}>
          📱 Scan with phone camera
        </Text>
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
    backgroundColor: '#fff',
  },
  webQRUrl: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  webQRInstruction: {
    fontSize: 12,
    color: '#2196F3',
    textAlign: 'center',
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
