import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';
import { User, Waiter, Supervisor, Manager } from '../types';
import { AmplifyAuthService } from './amplifyAuthService';

const client = generateClient<Schema>();

export class AmplifyUserManagementService {
  private static instance: AmplifyUserManagementService;
  private authService: AmplifyAuthService;

  static getInstance(): AmplifyUserManagementService {
    if (!AmplifyUserManagementService.instance) {
      AmplifyUserManagementService.instance = new AmplifyUserManagementService();
    }
    return AmplifyUserManagementService.instance;
  }

  constructor() {
    this.authService = AmplifyAuthService.getInstance();
  }

  // User Creation (for existing Cognito users)
  async createWaiterRecord(waiterData: {
    email: string;
    name: string;
    hotelId: string;
    supervisorId?: string;
  }): Promise<Waiter> {
    const { data: waiter } = await client.models.User.create({
      email: waiterData.email,
      name: waiterData.name,
      role: 'waiter',
      hotelId: waiterData.hotelId,
      supervisorId: waiterData.supervisorId,
      isActive: true,
      points: 0,
      level: 1,
      totalRatings: 0,
      averageRating: 0,
    });

    if (!waiter) {
      throw new Error('Failed to create waiter record');
    }

    return {
      id: waiter.id,
      name: waiter.name,
      email: waiter.email,
      role: 'waiter',
      hotelId: waiter.hotelId || '',
      isActive: waiter.isActive,
      createdAt: new Date(waiter.createdAt),
      updatedAt: waiter.updatedAt ? new Date(waiter.updatedAt) : undefined,
      points: waiter.points || 0,
      level: waiter.level || 1,
      badges: [],
      totalRatings: waiter.totalRatings || 0,
      averageRating: waiter.averageRating || 0,
    };
  }

  async createSupervisorRecord(supervisorData: {
    email: string;
    name: string;
    hotelId: string;
  }): Promise<Supervisor> {
    const { data: supervisor } = await client.models.User.create({
      email: supervisorData.email,
      name: supervisorData.name,
      role: 'supervisor',
      hotelId: supervisorData.hotelId,
      isActive: true,
    });

    if (!supervisor) {
      throw new Error('Failed to create supervisor record');
    }

    return {
      id: supervisor.id,
      name: supervisor.name,
      email: supervisor.email,
      role: 'supervisor',
      hotelId: supervisor.hotelId || '',
      isActive: supervisor.isActive,
      createdAt: new Date(supervisor.createdAt),
      updatedAt: supervisor.updatedAt ? new Date(supervisor.updatedAt) : undefined,
      permissions: [
        'view_analytics',
        'manage_waiters',
        'view_feedback',
        'generate_reports',
        'manage_shifts',
      ],
      managedWaiters: [],
    };
  }

  // User Retrieval
  async getAllWaiters(hotelId?: string): Promise<Waiter[]> {
    const filter: any = { role: { eq: 'waiter' } };
    if (hotelId) {
      filter.hotelId = { eq: hotelId };
    }

    const { data: users } = await client.models.User.list({ filter });

    return users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: 'waiter',
      hotelId: user.hotelId || '',
      isActive: user.isActive,
      createdAt: new Date(user.createdAt),
      updatedAt: user.updatedAt ? new Date(user.updatedAt) : undefined,
      points: user.points || 0,
      level: user.level || 1,
      badges: [],
      totalRatings: user.totalRatings || 0,
      averageRating: user.averageRating || 0,
    }));
  }

  async getActiveWaiters(hotelId?: string): Promise<Waiter[]> {
    const filter: any = { 
      role: { eq: 'waiter' },
      isActive: { eq: true }
    };
    if (hotelId) {
      filter.hotelId = { eq: hotelId };
    }

    const { data: users } = await client.models.User.list({ filter });

    return users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: 'waiter',
      hotelId: user.hotelId || '',
      isActive: user.isActive,
      createdAt: new Date(user.createdAt),
      updatedAt: user.updatedAt ? new Date(user.updatedAt) : undefined,
      points: user.points || 0,
      level: user.level || 1,
      badges: [],
      totalRatings: user.totalRatings || 0,
      averageRating: user.averageRating || 0,
    }));
  }

  async getSupervisors(hotelId?: string): Promise<Supervisor[]> {
    const filter: any = { role: { eq: 'supervisor' } };
    if (hotelId) {
      filter.hotelId = { eq: hotelId };
    }

    const { data: users } = await client.models.User.list({ filter });

    return users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: 'supervisor',
      hotelId: user.hotelId || '',
      isActive: user.isActive,
      createdAt: new Date(user.createdAt),
      updatedAt: user.updatedAt ? new Date(user.updatedAt) : undefined,
      permissions: [
        'view_analytics',
        'manage_waiters',
        'view_feedback',
        'generate_reports',
        'manage_shifts',
      ],
      managedWaiters: [],
    }));
  }

  async getWaitersBySupervisor(supervisorId: string): Promise<Waiter[]> {
    const { data: users } = await client.models.User.list({
      filter: {
        role: { eq: 'waiter' },
        supervisorId: { eq: supervisorId }
      }
    });

    return users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: 'waiter',
      hotelId: user.hotelId || '',
      isActive: user.isActive,
      createdAt: new Date(user.createdAt),
      updatedAt: user.updatedAt ? new Date(user.updatedAt) : undefined,
      points: user.points || 0,
      level: user.level || 1,
      badges: [],
      totalRatings: user.totalRatings || 0,
      averageRating: user.averageRating || 0,
    }));
  }

  // User Management
  async assignWaiterToSupervisor(waiterId: string, supervisorId: string): Promise<void> {
    await client.models.User.update({
      id: waiterId,
      supervisorId,
    });
  }

  async removeWaiterFromSupervisor(waiterId: string): Promise<void> {
    await client.models.User.update({
      id: waiterId,
      supervisorId: null,
    });
  }

  async activateUser(userId: string): Promise<void> {
    await client.models.User.update({
      id: userId,
      isActive: true,
    });
  }

  async deactivateUser(userId: string): Promise<void> {
    await client.models.User.update({
      id: userId,
      isActive: false,
    });
  }

  async updateUser(userId: string, updates: Partial<{
    name: string;
    email: string;
    isActive: boolean;
    points: number;
    level: number;
    totalRatings: number;
    averageRating: number;
  }>): Promise<void> {
    await client.models.User.update({
      id: userId,
      ...updates,
    });
  }

  // Team Analytics
  async getTeamStats(supervisorId?: string): Promise<{
    totalWaiters: number;
    activeWaiters: number;
    totalPoints: number;
    averageRating: number;
    topPerformer: Waiter | null;
  }> {
    let waiters: Waiter[];
    
    if (supervisorId) {
      waiters = await this.getWaitersBySupervisor(supervisorId);
    } else {
      waiters = await this.getAllWaiters();
    }

    const activeWaiters = waiters.filter(w => w.isActive);
    const totalPoints = waiters.reduce((sum, w) => sum + w.points, 0);
    const averageRating = waiters.length > 0 
      ? waiters.reduce((sum, w) => sum + w.averageRating, 0) / waiters.length 
      : 0;
    
    const topPerformer = waiters.length > 0 
      ? waiters.reduce((top, current) => 
          current.points > top.points ? current : top
        )
      : null;

    return {
      totalWaiters: waiters.length,
      activeWaiters: activeWaiters.length,
      totalPoints,
      averageRating,
      topPerformer,
    };
  }

  // Validation
  async validateEmailUnique(email: string, excludeUserId?: string): Promise<boolean> {
    const { data: users } = await client.models.User.list({
      filter: { email: { eq: email } }
    });
    
    return !users.some(u => u.id !== excludeUserId);
  }

  // Real-time subscriptions
  subscribeToTeamUpdates(supervisorId: string, callback: (waiters: Waiter[]) => void) {
    const subscription = client.models.User.observeQuery({
      filter: {
        role: { eq: 'waiter' },
        supervisorId: { eq: supervisorId }
      }
    }).subscribe({
      next: ({ items }) => {
        const waiters = items.map(user => ({
          id: user.id,
          name: user.name,
          email: user.email,
          role: 'waiter' as const,
          hotelId: user.hotelId || '',
          isActive: user.isActive,
          createdAt: new Date(user.createdAt),
          updatedAt: user.updatedAt ? new Date(user.updatedAt) : undefined,
          points: user.points || 0,
          level: user.level || 1,
          badges: [],
          totalRatings: user.totalRatings || 0,
          averageRating: user.averageRating || 0,
        }));
        callback(waiters);
      },
      error: (error) => console.error('Team subscription error:', error),
    });

    return subscription;
  }

  // Batch Operations
  async updateWaiterStats(waiterId: string, stats: {
    points: number;
    level: number;
    totalRatings: number;
    averageRating: number;
  }): Promise<void> {
    await client.models.User.update({
      id: waiterId,
      ...stats,
    });
  }

  // Get user by ID
  async getUserById(userId: string): Promise<User | null> {
    const { data: user } = await client.models.User.get({ id: userId });
    
    if (!user) {
      return null;
    }

    const baseUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as User['role'],
      hotelId: user.hotelId || '',
      isActive: user.isActive,
      createdAt: new Date(user.createdAt),
      updatedAt: user.updatedAt ? new Date(user.updatedAt) : undefined,
    };

    if (user.role === 'waiter') {
      return {
        ...baseUser,
        points: user.points || 0,
        level: user.level || 1,
        badges: [],
        totalRatings: user.totalRatings || 0,
        averageRating: user.averageRating || 0,
      } as Waiter;
    }

    if (user.role === 'supervisor') {
      return {
        ...baseUser,
        permissions: [
          'view_analytics',
          'manage_waiters',
          'view_feedback',
          'generate_reports',
          'manage_shifts',
        ],
        managedWaiters: [],
      } as Supervisor;
    }

    return baseUser;
  }
}
