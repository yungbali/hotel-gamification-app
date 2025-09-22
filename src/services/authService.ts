import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchUserAttributes, getCurrentUser, signIn, signOut } from 'aws-amplify/auth';
import { User, Waiter, Manager, Hotel } from '../types';
import { AmplifyStorageService } from './amplifyStorageService';
import { shouldUseAmplify } from './amplifyClient';
import { StorageService } from './storageService';

const API_BASE_URL = 'https://your-api-endpoint.com/api'; // Replace with actual API

export class AuthService {
  private static instance: AuthService;
  private currentUser: User | null = null;
  private currentHotel: Hotel | null = null;
  private storageService: StorageService;

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  constructor() {
    this.storageService = shouldUseAmplify()
      ? AmplifyStorageService.getInstance()
      : StorageService.getInstance();
  }

  async login(email: string, password: string): Promise<User> {
    try {
      // Use Amplify Auth if configured
      if (shouldUseAmplify()) {
        return await this.amplifyLogin(email, password);
      }
      
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await response.json();
      const user = data.user as User;
      
      await this.setCurrentUser(user);
      await this.setCurrentHotel(data.hotel);
      
      return user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Amplify Auth Methods
  private async amplifyLogin(email: string, password: string): Promise<User> {
    try {
      const result = await signIn({ username: email, password });

      if (!result.isSignedIn) {
        throw new Error('Sign in not completed');
      }

      const user = await this.getAmplifyCurrentUser();
      await this.setCurrentUser(user);

      return user;
    } catch (error) {
      console.error('Amplify login error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      // Use Amplify Auth if configured
      if (shouldUseAmplify()) {
        await signOut();
      }
      
      await this.storageService.clearUser();
      await AsyncStorage.removeItem('token');
      this.currentUser = null;
      this.currentHotel = null;
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  async getCurrentUser(): Promise<User | null> {
    if (this.currentUser) {
      return this.currentUser;
    }

    if (shouldUseAmplify()) {
      try {
       const user = await this.getAmplifyCurrentUser();
       this.currentUser = user;
        await this.storageService.storeUser(user);
        return user;
      } catch (error) {
        // If no Amplify session, fall back to local cache
      }
    }

    this.currentUser = await this.storageService.getCurrentUser();
    return this.currentUser;
  }

  async getCurrentHotel(): Promise<Hotel | null> {
    if (this.currentHotel) {
      return this.currentHotel;
    }

    this.currentHotel = await this.storageService.getCurrentHotel();
    return this.currentHotel;
  }

  async setCurrentUser(user: User): Promise<void> {
    await this.storageService.storeUser(user);
    this.currentUser = user;
  }

  async setCurrentHotel(hotel: Hotel): Promise<void> {
    await this.storageService.storeHotel(hotel);
    this.currentHotel = hotel;
  }

  async isAuthenticated(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return user !== null;
  }

  async refreshUserData(): Promise<User | null> {
    try {
      const currentUser = await this.getCurrentUser();
      if (!currentUser) return null;

      const response = await fetch(`${API_BASE_URL}/users/${currentUser.id}`, {
        headers: {
          'Authorization': `Bearer ${await this.getToken()}`,
        },
      });

      if (response.ok) {
        const updatedUser = await response.json();
        await this.setCurrentUser(updatedUser);
        return updatedUser;
      }
    } catch (error) {
      console.error('Refresh user data error:', error);
    }
    return null;
  }

  private async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('token');
    } catch (error) {
      console.error('Get token error:', error);
      return null;
    }
  }

  // Mock login for development
  async mockLogin(email: string, password: string): Promise<User> {
    // Initialize storage
    await this.storageService.initializeStorage();
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check stored credentials
    const storedCredentials = await this.getStoredCredentials();
    const credentialMatch = storedCredentials.find(c => 
      c.email.toLowerCase() === email.toLowerCase() && c.password === password
    );
    
    if (!credentialMatch) {
      throw new Error('Invalid credentials');
    }

    // Get users from storage
    const users = await this.storageService.getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      throw new Error('User not found');
    }

    await this.setCurrentUser(user);
    
    const hotel = await this.storageService.getCurrentHotel();
    if (hotel) {
      this.currentHotel = hotel;
    }

    return user;
  }

  // Helper methods for credential management
  async mockStoreCredentials(email: string, password: string): Promise<void> {
    const credentials = await this.getStoredCredentials();
    const existingIndex = credentials.findIndex(c => c.email.toLowerCase() === email.toLowerCase());
    
    if (existingIndex >= 0) {
      credentials[existingIndex].password = password;
    } else {
      credentials.push({ email: email.toLowerCase(), password });
    }
    
    await AsyncStorage.setItem('mock_credentials', JSON.stringify(credentials));
  }

  private async getStoredCredentials(): Promise<Array<{email: string, password: string}>> {
    try {
      const stored = await AsyncStorage.getItem('mock_credentials');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private async getAmplifyCurrentUser(): Promise<User> {
    const cognitoUser = await getCurrentUser();
    const attributes = await fetchUserAttributes();

    const role = (attributes['custom:role'] as User['role']) || 'waiter';
    const hotelId = (attributes['custom:hotelId'] as string) || 'default_hotel';
    const givenName = attributes.given_name || ''; // optional
    const familyName = attributes.family_name || '';

    return {
      id: cognitoUser.userId,
      email: attributes.email ?? '',
      name: `${givenName} ${familyName}`.trim() || cognitoUser.username,
      role: role,
      hotelId,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}
