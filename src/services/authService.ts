import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Waiter, Manager, Hotel } from '../types';
import { StorageService } from './storageService';
import { isAmplifyConfigured, shouldUseAmplify } from './amplifyClient';
import { signIn, signOut, getCurrentUser, signUp, confirmSignUp, fetchAuthSession } from 'aws-amplify/auth';

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
    this.storageService = StorageService.getInstance();
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
  async amplifyLogin(email: string, password: string): Promise<User> {
    try {
      const signInResult = await signIn({ username: email, password });
      
      if (signInResult.isSignedIn) {
        const cognitoUser = await getCurrentUser();
        
        // Convert Cognito user to our User type
        const user: User = {
          id: cognitoUser.userId,
          email: email,
          name: cognitoUser.username,
          role: 'waiter', // Default role, can be customized
          hotelId: 'hotel_1', // Default hotel, can be from custom attributes
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        await this.setCurrentUser(user);
        return user;
      } else {
        throw new Error('Sign in not completed');
      }
    } catch (error) {
      console.error('Amplify login error:', error);
      throw error;
    }
  }

  async amplifySignUp(email: string, password: string, name: string, role: 'waiter' | 'manager' = 'waiter'): Promise<void> {
    try {
      await signUp({
        username: email,
        password: password,
        options: {
          userAttributes: {
            email: email,
            given_name: name.split(' ')[0] || name,
            family_name: name.split(' ')[1] || '',
            'custom:role': role,
            'custom:hotelId': 'hotel_1', // Default hotel
          }
        }
      });
    } catch (error) {
      console.error('Amplify sign up error:', error);
      throw error;
    }
  }

  async amplifyConfirmSignUp(email: string, confirmationCode: string): Promise<void> {
    try {
      await confirmSignUp({
        username: email,
        confirmationCode: confirmationCode
      });
    } catch (error) {
      console.error('Amplify confirm sign up error:', error);
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

  // Mock data for development
  async mockLogin(email: string, password: string): Promise<User> {
    // Initialize demo data if needed
    await this.storageService.initializeDemoData();
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Get users from storage
    const users = await this.storageService.getUsers();
    const user = users.find(u => u.email === email);
    
    if (!user || password !== 'password') {
      throw new Error('Invalid credentials');
    }

    await this.setCurrentUser(user);
    
    const hotel = await this.storageService.getCurrentHotel();
    if (hotel) {
      this.currentHotel = hotel;
    }

    return user;
  }
}
