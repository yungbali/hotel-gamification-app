import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';
import type { Schema } from '../../amplify/data/resource';

let configured = false;
let client: ReturnType<typeof generateClient<Schema>> | null = null;

export const configureAmplify = async () => {
  if (!configured) {
    try {
      // In production, this will be auto-generated after deployment
      // For now, we'll handle the case where outputs don't exist yet
      const { default: outputs } = await import('../../amplify_outputs.json').catch(() => ({
        default: null
      }));

      if (outputs) {
        Amplify.configure({
          ...outputs,
          ssr: false,
        });
        
        client = generateClient<Schema>();
        configured = true;
        console.log('✅ Amplify configured successfully');
      } else {
        console.log('⚠️ Amplify outputs not found - running in local mode');
        // Keep configured as false to use AsyncStorage fallback
      }
    } catch (error) {
      console.error('❌ Error configuring Amplify:', error);
      // Fallback to local storage mode
    }
  }
  
  return { configured, client };
};

export const getAmplifyClient = () => {
  if (!configured || !client) {
    throw new Error('Amplify not configured. Call configureAmplify() first.');
  }
  return client;
};

export const isAmplifyConfigured = () => configured;

// Environment detection
export const getEnvironment = () => {
  if (typeof window !== 'undefined' && window.location) {
    // Web environment
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'development';
    } else if (hostname.includes('amplifyapp.com')) {
      return 'production';
    } else if (hostname.includes('github.io')) {
      return 'staging';
    }
  }
  
  // React Native or Node environment
  return process.env.NODE_ENV || 'development';
};

// Utility to check if we should use Amplify or local storage
export const shouldUseAmplify = () => {
  const env = getEnvironment();
  return configured && (env === 'production' || env === 'staging');
};
