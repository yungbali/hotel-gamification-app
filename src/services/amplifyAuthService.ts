import { 
  signUp, 
  signIn, 
  signOut, 
  getCurrentUser, 
  fetchUserAttributes,
  updateUserAttributes,
  confirmSignUp,
  resendSignUpCode,
  resetPassword,
  confirmResetPassword,
} from 'aws-amplify/auth';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';
import { User, Hotel, Supervisor, Waiter } from '../types';

const client = generateClient<Schema>();

export class AmplifyAuthService {
  private static instance: AmplifyAuthService;
  private currentUser: User | null = null;
  private currentHotel: Hotel | null = null;

  static getInstance(): AmplifyAuthService {
    if (!AmplifyAuthService.instance) {
      AmplifyAuthService.instance = new AmplifyAuthService();
    }
    return AmplifyAuthService.instance;
  }

  // Authentication Methods
  async signUp(
    email: string, 
    password: string, 
    userData: {
      name: string;
      role: 'waiter' | 'supervisor' | 'manager' | 'admin';
      hotelId: string;
      supervisorId?: string;
    }
  ): Promise<void> {
    const [givenName, ...familyNameParts] = userData.name.split(' ');
    const familyName = familyNameParts.join(' ') || '';

    await signUp({
      username: email,
      password,
      options: {
        userAttributes: {
          email,
          given_name: givenName,
          family_name: familyName,
          'custom:role': userData.role,
          'custom:hotelId': userData.hotelId,
          'custom:supervisorId': userData.supervisorId || '',
        },
      },
    });
  }

  async confirmSignUp(email: string, confirmationCode: string): Promise<void> {
    await confirmSignUp({
      username: email,
      confirmationCode,
    });
  }

  async signIn(email: string, password: string): Promise<User> {
    const { isSignedIn } = await signIn({
      username: email,
      password,
    });

    if (!isSignedIn) {
      throw new Error('Sign in failed');
    }

    const user = await this.getCurrentUser();
    if (!user) {
      throw new Error('Failed to get user data');
    }

    return user;
  }

  async signOut(): Promise<void> {
    await signOut();
    this.currentUser = null;
    this.currentHotel = null;
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const cognitoUser = await getCurrentUser();
      const attributes = await fetchUserAttributes();

      const role = (attributes['custom:role'] as User['role']) || 'waiter';
      const hotelId = attributes['custom:hotelId'] || '';
      const supervisorId = attributes['custom:supervisorId'] || undefined;
      const givenName = attributes.given_name || '';
      const familyName = attributes.family_name || '';

      // Get user data from DataStore
      const { data: users } = await client.models.User.list({
        filter: { email: { eq: attributes.email } }
      });

      let userData = users[0];

      // If user doesn't exist in DataStore, create them
      if (!userData) {
        const { data: newUser } = await client.models.User.create({
          email: attributes.email || '',
          name: `${givenName} ${familyName}`.trim() || cognitoUser.username,
          role,
          hotelId,
          supervisorId,
          isActive: true,
        });
        userData = newUser;
      }

      if (!userData) {
        throw new Error('Failed to create or retrieve user data');
      }

      const user: User = {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        role: userData.role as User['role'],
        hotelId: userData.hotelId || '',
        isActive: userData.isActive,
        createdAt: new Date(userData.createdAt),
        updatedAt: userData.updatedAt ? new Date(userData.updatedAt) : undefined,
      };

      // Add role-specific data
      if (role === 'waiter') {
        (user as Waiter).points = userData.points || 0;
        (user as Waiter).level = userData.level || 1;
        (user as Waiter).badges = []; // Will be loaded separately
        (user as Waiter).totalRatings = userData.totalRatings || 0;
        (user as Waiter).averageRating = userData.averageRating || 0;
        (user as Waiter).currentShiftId = undefined; // Will be loaded separately
      }

      if (role === 'supervisor') {
        (user as Supervisor).permissions = [
          'view_analytics',
          'manage_waiters',
          'view_feedback',
          'generate_reports',
          'manage_shifts',
        ];
        (user as Supervisor).managedWaiters = []; // Will be loaded separately
      }

      this.currentUser = user;
      return user;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  async isAuthenticated(): Promise<boolean> {
    try {
      await getCurrentUser();
      return true;
    } catch {
      return false;
    }
  }

  // Hotel Management
  async getCurrentHotel(): Promise<Hotel | null> {
    if (this.currentHotel) {
      return this.currentHotel;
    }

    try {
      const user = await this.getCurrentUser();
      if (!user?.hotelId) {
        return null;
      }

      const { data: hotel } = await client.models.Hotel.get({ id: user.hotelId });
      
      if (hotel) {
        this.currentHotel = {
          id: hotel.id,
          name: hotel.name,
          address: hotel.address || '',
          timezone: hotel.timezone || 'UTC',
          settings: {
            pointsPer4Star: 10,
            pointsPer5Star: 20,
            maxPointsPerShift: 200,
            geofencingEnabled: false,
            geofenceRadius: 100,
            location: {
              latitude: 0,
              longitude: 0,
            },
          },
        };
      }

      return this.currentHotel;
    } catch (error) {
      console.error('Get current hotel error:', error);
      return null;
    }
  }

  async createHotel(hotelData: {
    name: string;
    address: string;
    timezone?: string;
  }): Promise<Hotel> {
    const { data: hotel } = await client.models.Hotel.create({
      name: hotelData.name,
      address: hotelData.address,
      timezone: hotelData.timezone || 'UTC',
    });

    if (!hotel) {
      throw new Error('Failed to create hotel');
    }

    const newHotel: Hotel = {
      id: hotel.id,
      name: hotel.name,
      address: hotel.address || '',
      timezone: hotel.timezone || 'UTC',
      settings: {
        pointsPer4Star: 10,
        pointsPer5Star: 20,
        maxPointsPerShift: 200,
        geofencingEnabled: false,
        geofenceRadius: 100,
        location: {
          latitude: 0,
          longitude: 0,
        },
      },
    };

    this.currentHotel = newHotel;
    return newHotel;
  }

  // User Management
  async updateUserAttributes(attributes: Record<string, string>): Promise<void> {
    await updateUserAttributes({ userAttributes: attributes });
  }

  async updateUserRole(userId: string, role: User['role']): Promise<void> {
    // Update in Cognito
    await this.updateUserAttributes({ 'custom:role': role });

    // Update in DataStore
    await client.models.User.update({
      id: userId,
      role,
    });
  }

  // Password Management
  async resetPassword(email: string): Promise<void> {
    await resetPassword({ username: email });
  }

  async confirmResetPassword(
    email: string, 
    confirmationCode: string, 
    newPassword: string
  ): Promise<void> {
    await confirmResetPassword({
      username: email,
      confirmationCode,
      newPassword,
    });
  }

  // Setup Methods for Initial Configuration
  async setupSupervisor(supervisorData: {
    email: string;
    password: string;
    name: string;
    hotelId: string;
  }): Promise<void> {
    await this.signUp(supervisorData.email, supervisorData.password, {
      name: supervisorData.name,
      role: 'supervisor',
      hotelId: supervisorData.hotelId,
    });

    // Auto-confirm for setup (in production, you'd handle email confirmation)
    // This would typically require admin privileges or a custom Lambda
    console.log('Supervisor signup initiated. Email confirmation required.');
  }

  async setupWaiters(waitersData: Array<{
    email: string;
    name: string;
    hotelId: string;
    supervisorId: string;
  }>): Promise<void> {
    const defaultPassword = 'TempPass123!'; // In production, generate random passwords

    for (const waiterData of waitersData) {
      try {
        await this.signUp(waiterData.email, defaultPassword, {
          name: waiterData.name,
          role: 'waiter',
          hotelId: waiterData.hotelId,
          supervisorId: waiterData.supervisorId,
        });
        console.log(`Waiter ${waiterData.name} signup initiated`);
      } catch (error) {
        console.error(`Failed to setup waiter ${waiterData.name}:`, error);
      }
    }
  }

  // Utility Methods
  async refreshUserData(): Promise<User | null> {
    this.currentUser = null;
    return this.getCurrentUser();
  }

  async checkSetupRequired(): Promise<boolean> {
    try {
      const { data: hotels } = await client.models.Hotel.list();
      return hotels.length === 0;
    } catch (error) {
      console.error('Check setup required error:', error);
      return true;
    }
  }
}
