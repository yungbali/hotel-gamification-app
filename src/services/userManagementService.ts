import { User, Waiter, Supervisor, Manager } from '../types';
import { getDataService, DataService } from './dataService';

export class UserManagementService {
  private static instance: UserManagementService;
  private dataService: DataService;

  static getInstance(): UserManagementService {
    if (!UserManagementService.instance) {
      UserManagementService.instance = new UserManagementService();
    }
    return UserManagementService.instance;
  }

  constructor() {
    this.dataService = getDataService();
  }

  // User Creation
  async createWaiter(waiterData: {
    name: string;
    email: string;
    hotelId: string;
    avatar?: string;
  }): Promise<Waiter> {
    const waiter: Waiter = {
      id: `waiter_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: waiterData.name,
      email: waiterData.email,
      role: 'waiter',
      hotelId: waiterData.hotelId,
      avatar: waiterData.avatar,
      isActive: true,
      createdAt: new Date(),
      points: 0,
      level: 1,
      badges: [],
      totalRatings: 0,
      averageRating: 0,
    };

    await this.dataService.storeUser(waiter);
    return waiter;
  }

  async createSupervisor(supervisorData: {
    name: string;
    email: string;
    hotelId: string;
    avatar?: string;
    managedWaiters?: string[];
  }): Promise<Supervisor> {
    const supervisor: Supervisor = {
      id: `supervisor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: supervisorData.name,
      email: supervisorData.email,
      role: 'supervisor',
      hotelId: supervisorData.hotelId,
      avatar: supervisorData.avatar,
      isActive: true,
      createdAt: new Date(),
      permissions: [
        'view_analytics',
        'manage_waiters',
        'view_feedback',
        'generate_reports',
        'manage_shifts',
      ],
      managedWaiters: supervisorData.managedWaiters || [],
    };

    await this.dataService.storeUser(supervisor);
    return supervisor;
  }

  // User Management
  async getAllWaiters(hotelId?: string): Promise<Waiter[]> {
    const users = await this.dataService.getUsers();
    return users.filter(user => 
      user.role === 'waiter' && 
      (!hotelId || user.hotelId === hotelId)
    ) as Waiter[];
  }

  async getActiveWaiters(hotelId?: string): Promise<Waiter[]> {
    const waiters = await this.getAllWaiters(hotelId);
    return waiters.filter(waiter => waiter.isActive);
  }

  async getSupervisors(hotelId?: string): Promise<Supervisor[]> {
    const users = await this.dataService.getUsers();
    return users.filter(user => 
      user.role === 'supervisor' && 
      (!hotelId || user.hotelId === hotelId)
    ) as Supervisor[];
  }

  async assignWaiterToSupervisor(waiterId: string, supervisorId: string): Promise<void> {
    const users = await this.dataService.getUsers();
    const supervisorIndex = users.findIndex(u => u.id === supervisorId && u.role === 'supervisor');
    
    if (supervisorIndex >= 0) {
      const supervisor = users[supervisorIndex] as Supervisor;
      if (!supervisor.managedWaiters.includes(waiterId)) {
        supervisor.managedWaiters.push(waiterId);
        await this.dataService.storeUser(supervisor);
      }
    }
  }

  async removeWaiterFromSupervisor(waiterId: string, supervisorId: string): Promise<void> {
    const users = await this.dataService.getUsers();
    const supervisorIndex = users.findIndex(u => u.id === supervisorId && u.role === 'supervisor');
    
    if (supervisorIndex >= 0) {
      const supervisor = users[supervisorIndex] as Supervisor;
      supervisor.managedWaiters = supervisor.managedWaiters.filter(id => id !== waiterId);
      await this.dataService.storeUser(supervisor);
    }
  }

  async getWaitersBySupervisor(supervisorId: string): Promise<Waiter[]> {
    const users = await this.dataService.getUsers();
    const supervisor = users.find(u => u.id === supervisorId && u.role === 'supervisor') as Supervisor;
    
    if (!supervisor) return [];
    
    return users.filter(u => 
      u.role === 'waiter' && 
      supervisor.managedWaiters.includes(u.id)
    ) as Waiter[];
  }

  // User Status Management
  async activateUser(userId: string): Promise<void> {
    const users = await this.dataService.getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex >= 0) {
      users[userIndex].isActive = true;
      users[userIndex].updatedAt = new Date();
      await this.dataService.storeUser(users[userIndex]);
    }
  }

  async deactivateUser(userId: string): Promise<void> {
    const users = await this.dataService.getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex >= 0) {
      users[userIndex].isActive = false;
      users[userIndex].updatedAt = new Date();
      await this.dataService.storeUser(users[userIndex]);
    }
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<void> {
    const users = await this.dataService.getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex >= 0) {
      const updatedUser = {
        ...users[userIndex],
        ...updates,
        updatedAt: new Date(),
      };
      await this.dataService.storeUser(updatedUser);
    }
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

  // Bulk Operations
  async bulkCreateWaiters(waitersData: Array<{
    name: string;
    email: string;
    hotelId: string;
    avatar?: string;
  }>): Promise<Waiter[]> {
    const createdWaiters: Waiter[] = [];
    
    for (const waiterData of waitersData) {
      const waiter = await this.createWaiter(waiterData);
      createdWaiters.push(waiter);
    }
    
    return createdWaiters;
  }

  async bulkUpdateWaiters(updates: Array<{
    userId: string;
    data: Partial<User>;
  }>): Promise<void> {
    for (const update of updates) {
      await this.updateUser(update.userId, update.data);
    }
  }

  // Validation
  async validateEmailUnique(email: string, excludeUserId?: string): Promise<boolean> {
    const users = await this.dataService.getUsers();
    return !users.some(u => 
      u.email.toLowerCase() === email.toLowerCase() && 
      u.id !== excludeUserId
    );
  }
}
