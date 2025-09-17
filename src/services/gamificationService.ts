import { Waiter, Badge, Leaderboard, LeaderboardEntry } from '../types';
import { StorageService } from './storageService';

export class GamificationService {
  private static instance: GamificationService;
  private storageService: StorageService;

  static getInstance(): GamificationService {
    if (!GamificationService.instance) {
      GamificationService.instance = new GamificationService();
    }
    return GamificationService.instance;
  }

  constructor() {
    this.storageService = StorageService.getInstance();
  }

  async calculatePoints(rating: number): Promise<number> {
    // Based on PRD: 4 stars = 10 points, 5 stars = 20 points
    switch (rating) {
      case 4:
        return 10;
      case 5:
        return 20;
      default:
        return 0;
    }
  }

  async getLeaderboard(type: 'weekly' | 'monthly' | 'all-time' = 'weekly'): Promise<Leaderboard> {
    return this.storageService.calculateLeaderboard(type);
  }

  async getTopPerformers(type: 'weekly' | 'monthly' | 'all-time' = 'weekly'): Promise<LeaderboardEntry[]> {
    const leaderboard = await this.getLeaderboard(type);
    return leaderboard.entries.slice(0, 5);
  }

  async getWaiterProfile(waiterId: string): Promise<Waiter | null> {
    const users = await this.storageService.getUsers();
    const waiter = users.find(user => user.id === waiterId && user.role === 'waiter') as Waiter | undefined;
    if (!waiter) {
      return null;
    }

    const badges = await this.storageService.getBadgesByWaiter(waiterId);
    return { ...waiter, badges };
  }

  async getBadgesForWaiter(waiterId: string): Promise<Badge[]> {
    return this.storageService.getBadgesByWaiter(waiterId);
  }
}
