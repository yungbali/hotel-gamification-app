import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Waiter, Manager, Rating, QRCode, Shift, Badge, Leaderboard, Analytics, Hotel } from '../types';

export class StorageService {
  private static instance: StorageService;
  private static readonly DEMO_DATA_VERSION = '2024-11-05';

  static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  // Generic storage methods
  private async setItem<T>(key: string, value: T): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error storing ${key}:`, error);
      throw error;
    }
  }

  private async getItem<T>(key: string): Promise<T | null> {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error(`Error retrieving ${key}:`, error);
      return null;
    }
  }

  private async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key}:`, error);
      throw error;
    }
  }

  // User management
  async storeUser(user: User): Promise<void> {
    await this.setItem('current_user', user);
    
    // Also store in users list
    const users = await this.getUsers();
    const existingIndex = users.findIndex(u => u.id === user.id);
    if (existingIndex >= 0) {
      users[existingIndex] = user;
    } else {
      users.push(user);
    }
    await this.setItem('users', users);
  }

  async getCurrentUser(): Promise<User | null> {
    return await this.getItem<User>('current_user');
  }

  async getUsers(): Promise<User[]> {
    return await this.getItem<User[]>('users') || [];
  }

  async clearUser(): Promise<void> {
    await this.removeItem('current_user');
  }

  // Hotel management
  async storeHotel(hotel: Hotel): Promise<void> {
    await this.setItem('current_hotel', hotel);
  }

  async getCurrentHotel(): Promise<Hotel | null> {
    return await this.getItem<Hotel>('current_hotel');
  }

  // Ratings management
  async storeRating(rating: Rating): Promise<void> {
    const ratings = await this.getRatings();
    ratings.push(rating);
    await this.setItem('ratings', ratings);
    
    // Update waiter stats
    await this.updateWaiterStats(rating.waiterId);
  }

  async getRatings(): Promise<Rating[]> {
    return await this.getItem<Rating[]>('ratings') || [];
  }

  async getRatingsByWaiter(waiterId: string): Promise<Rating[]> {
    const ratings = await this.getRatings();
    return ratings.filter(r => r.waiterId === waiterId);
  }

  async getRatingsByDateRange(startDate: Date, endDate: Date): Promise<Rating[]> {
    const ratings = await this.getRatings();
    return ratings.filter(r => {
      const ratingDate = new Date(r.timestamp);
      return ratingDate >= startDate && ratingDate <= endDate;
    });
  }

  async resolveRating(ratingId: string, managerId?: string, notes?: string): Promise<void> {
    const ratings = await this.getRatings();
    const target = ratings.find(r => r.id === ratingId);

    if (!target) {
      return;
    }

    target.isFlagged = false;
    target.resolvedAt = new Date();
    if (managerId) {
      target.resolvedBy = managerId;
    }
    if (notes) {
      target.resolutionNotes = notes;
    }

    await this.setItem('ratings', ratings);
    await this.updateWaiterStats(target.waiterId);
  }

  async deleteRating(ratingId: string): Promise<void> {
    const ratings = await this.getRatings();
    const index = ratings.findIndex(r => r.id === ratingId);

    if (index === -1) {
      return;
    }

    const [removed] = ratings.splice(index, 1);
    await this.setItem('ratings', ratings);
    if (removed) {
      await this.updateWaiterStats(removed.waiterId);
    }
  }

  // QR Code management
  async storeQRCode(qrCode: QRCode): Promise<void> {
    const qrCodes = await this.getQRCodes();
    const existingIndex = qrCodes.findIndex(q => q.id === qrCode.id);
    if (existingIndex >= 0) {
      qrCodes[existingIndex] = qrCode;
    } else {
      qrCodes.push(qrCode);
    }
    await this.setItem('qr_codes', qrCodes);
  }

  async getQRCodes(): Promise<QRCode[]> {
    return await this.getItem<QRCode[]>('qr_codes') || [];
  }

  async getQRCodeByToken(token: string): Promise<QRCode | null> {
    const qrCodes = await this.getQRCodes();
    return qrCodes.find(q => q.token === token) || null;
  }

  async getActiveQRCodeByWaiter(waiterId: string): Promise<QRCode | null> {
    const qrCodes = await this.getQRCodes();
    return qrCodes.find(q => q.waiterId === waiterId && !q.isUsed && new Date(q.expiresAt) > new Date()) || null;
  }

  // Shift management
  async storeShift(shift: Shift): Promise<void> {
    const shifts = await this.getShifts();
    const existingIndex = shifts.findIndex(s => s.id === shift.id);
    if (existingIndex >= 0) {
      shifts[existingIndex] = shift;
    } else {
      shifts.push(shift);
    }
    await this.setItem('shifts', shifts);
  }

  async getShifts(): Promise<Shift[]> {
    return await this.getItem<Shift[]>('shifts') || [];
  }

  async getActiveShiftByWaiter(waiterId: string): Promise<Shift | null> {
    const shifts = await this.getShifts();
    return shifts.find(s => s.waiterId === waiterId && s.isActive) || null;
  }

  async endShift(shiftId: string): Promise<void> {
    const shifts = await this.getShifts();
    const shift = shifts.find(s => s.id === shiftId);
    if (shift) {
      shift.isActive = false;
      shift.endTime = new Date();
      await this.storeShift(shift);
    }
  }

  // Badge management
  async storeBadge(waiterId: string, badge: Badge): Promise<void> {
    const badges = await this.getBadgesByWaiter(waiterId);
    if (!badges.find(b => b.id === badge.id)) {
      badges.push(badge);
      await this.setItem(`badges_${waiterId}`, badges);
    }
  }

  async getBadgesByWaiter(waiterId: string): Promise<Badge[]> {
    return await this.getItem<Badge[]>(`badges_${waiterId}`) || [];
  }

  // Stats and calculations
  private async updateWaiterStats(waiterId: string): Promise<void> {
    const ratings = await this.getRatingsByWaiter(waiterId);
    const users = await this.getUsers();
    const waiterIndex = users.findIndex(u => u.id === waiterId);
    
    if (waiterIndex >= 0 && users[waiterIndex].role === 'waiter') {
      const waiter = users[waiterIndex] as Waiter;
      
      // Calculate stats
      waiter.totalRatings = ratings.length;
      waiter.averageRating = ratings.length > 0 
        ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length 
        : 0;
      
      // Calculate points (4 stars = 10 points, 5 stars = 20 points)
      waiter.points = ratings.reduce((total, r) => {
        if (r.rating === 4) return total + 10;
        if (r.rating === 5) return total + 20;
        return total;
      }, 0);
      
      // Calculate level (every 100 points = 1 level)
      waiter.level = Math.floor(waiter.points / 100) + 1;
      
      // Check for new badges
      await this.checkAndAwardBadges(waiter);
      
      await this.storeUser(waiter);
    }
  }

  private async checkAndAwardBadges(waiter: Waiter): Promise<void> {
    const currentBadges = await this.getBadgesByWaiter(waiter.id);
    const newBadges: Badge[] = [];

    // Define badge criteria
    const badgeDefinitions = [
      {
        id: 'first_rating',
        name: 'First Rating',
        description: 'Received your first rating',
        icon: '⭐',
        category: 'rating' as const,
        pointsRequired: 0,
        condition: () => waiter.totalRatings >= 1
      },
      {
        id: 'five_star_service',
        name: 'Five Star Service',
        description: 'Received a 5-star rating',
        icon: '🌟',
        category: 'rating' as const,
        pointsRequired: 0,
        condition: async () => {
          const ratings = await this.getRatingsByWaiter(waiter.id);
          return ratings.some(r => r.rating === 5);
        }
      },
      {
        id: 'century_club',
        name: 'Century Club',
        description: 'Earned 100 points',
        icon: '💯',
        category: 'points' as const,
        pointsRequired: 100,
        condition: () => waiter.points >= 100
      },
      {
        id: 'consistent_performer',
        name: 'Consistent Performer',
        description: 'Maintained 4+ average rating with 10+ reviews',
        icon: '🎯',
        category: 'consistency' as const,
        pointsRequired: 0,
        condition: () => waiter.averageRating >= 4.0 && waiter.totalRatings >= 10
      },
      {
        id: 'rising_star',
        name: 'Rising Star',
        description: 'Reached level 3',
        icon: '🚀',
        category: 'points' as const,
        pointsRequired: 200,
        condition: () => waiter.level >= 3
      }
    ];

    for (const def of badgeDefinitions) {
      const alreadyHas = currentBadges.find(b => b.id === def.id);
      if (!alreadyHas) {
        const conditionMet = typeof def.condition === 'function' 
          ? await def.condition() 
          : def.condition;
        
        if (conditionMet) {
          const badge: Badge = {
            id: def.id,
            name: def.name,
            description: def.description,
            icon: def.icon,
            pointsRequired: def.pointsRequired,
            category: def.category,
            isUnlocked: true,
            unlockedAt: new Date()
          };
          
          newBadges.push(badge);
          await this.storeBadge(waiter.id, badge);
        }
      }
    }

    // Update waiter's badges
    if (newBadges.length > 0) {
      waiter.badges = [...currentBadges, ...newBadges];
      await this.storeUser(waiter);
    }
  }

  // Leaderboard calculations
  async calculateLeaderboard(type: 'weekly' | 'monthly' | 'all-time'): Promise<Leaderboard> {
    const users = await this.getUsers();
    const waiters = users.filter(u => u.role === 'waiter') as Waiter[];
    
    // Get date range for filtering
    let startDate: Date;
    const now = new Date();
    
    switch (type) {
      case 'weekly':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
      case 'monthly':
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'all-time':
        startDate = new Date(0);
        break;
    }
    
    // Calculate points for the period
    const entries = await Promise.all(waiters.map(async (waiter, index) => {
      const ratings = await this.getRatingsByDateRange(startDate, now);
      const waiterRatings = ratings.filter(r => r.waiterId === waiter.id);
      
      const periodPoints = waiterRatings.reduce((total, r) => {
        if (r.rating === 4) return total + 10;
        if (r.rating === 5) return total + 20;
        return total;
      }, 0);
      
      const periodAverage = waiterRatings.length > 0
        ? waiterRatings.reduce((sum, r) => sum + r.rating, 0) / waiterRatings.length
        : 0;

      return {
        waiterId: waiter.id,
        waiterName: waiter.name,
        points: type === 'all-time' ? waiter.points : periodPoints,
        level: waiter.level,
        badges: waiter.badges,
        averageRating: type === 'all-time' ? waiter.averageRating : periodAverage,
        position: 0, // Will be set after sorting
        change: 0 // Mock change for now
      };
    }));
    
    // Sort by points descending
    entries.sort((a, b) => b.points - a.points);
    
    // Set positions
    entries.forEach((entry, index) => {
      entry.position = index + 1;
    });
    
    return {
      id: `leaderboard_${type}_${Date.now()}`,
      type,
      period: this.formatPeriod(type, startDate, now),
      entries,
      lastUpdated: new Date()
    };
  }

  private formatPeriod(type: string, startDate: Date, endDate: Date): string {
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    
    switch (type) {
      case 'weekly':
        return `${startDate.toLocaleDateString('en-US', options)} - ${endDate.toLocaleDateString('en-US', options)}`;
      case 'monthly':
        return endDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      case 'all-time':
        return 'All Time';
      default:
        return type;
    }
  }

  // Analytics calculations
  async calculateAnalytics(period: string = 'week'): Promise<Analytics> {
    const ratings = await this.getRatings();
    const users = await this.getUsers();
    const waiters = users.filter(u => u.role === 'waiter') as Waiter[];
    
    // Filter ratings by period
    let filteredRatings = ratings;
    if (period !== 'all-time') {
      const daysBack = period === 'week' ? 7 : period === 'month' ? 30 : 90;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysBack);
      filteredRatings = ratings.filter(r => new Date(r.timestamp) >= startDate);
    }
    
    const totalRatings = filteredRatings.length;
    const averageRating = totalRatings > 0
      ? filteredRatings.reduce((sum, r) => sum + r.rating, 0) / totalRatings
      : 0;
    
    // Calculate guest satisfaction distribution
    const guestSatisfaction = {
      excellent: Math.round((filteredRatings.filter(r => r.rating === 5).length / totalRatings) * 100) || 0,
      good: Math.round((filteredRatings.filter(r => r.rating === 4).length / totalRatings) * 100) || 0,
      average: Math.round((filteredRatings.filter(r => r.rating === 3).length / totalRatings) * 100) || 0,
      poor: Math.round((filteredRatings.filter(r => r.rating === 2).length / totalRatings) * 100) || 0,
      terrible: Math.round((filteredRatings.filter(r => r.rating === 1).length / totalRatings) * 100) || 0,
    };
    
    // Get top performers
    const leaderboard = await this.calculateLeaderboard('weekly');
    const topPerformers = leaderboard.entries.slice(0, 5);
    
    // Generate recent trends (last 7 days)
    const recentTrends = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);
      
      const dayRatings = ratings.filter(r => {
        const ratingDate = new Date(r.timestamp);
        return ratingDate >= dayStart && ratingDate <= dayEnd;
      });
      
      recentTrends.push({
        date: date.toISOString().split('T')[0],
        ratings: dayRatings.length,
        averageRating: dayRatings.length > 0
          ? dayRatings.reduce((sum, r) => sum + r.rating, 0) / dayRatings.length
          : 0
      });
    }
    
    return {
      totalRatings,
      averageRating,
      responseRate: Math.round(Math.random() * 20 + 20), // Mock response rate 20-40%
      topPerformers,
      recentTrends,
      fraudAlerts: [], // No fraud alerts for demo
      guestSatisfaction
    };
  }

  // Initialize demo data
  async initializeStorage(): Promise<void> {
    // Basic storage initialization without demo data
    const existingUsers = await this.getUsers();
    console.log(`Storage initialized. Found ${existingUsers.length} existing users.`);
  }

  private async createDemoRatings(): Promise<void> {
    const positiveComments = [
      'Fantastic attentiveness all night.',
      'Perfect wine pairing suggestion!',
      'Swift service and great hospitality.',
      'Made our anniversary feel special.',
      'Handled dietary needs flawlessly.',
    ];

    const improvementComments = [
      'Waited a bit long between courses.',
      'Drink order was delayed tonight.',
      'Forgot to check back after the meal arrived.',
      'Table was ready later than expected.',
      'Bill took multiple reminders to arrive.',
    ];

    const neutralComments = [
      'Friendly, just a little slow during the rush.',
      'Solid service, nothing extraordinary.',
      'Handled the table politely throughout.',
      'Kept beverages topped up, thank you.',
    ];

    const waiterProfiles = [
      {
        id: '1',
        weights: { 5: 0.6, 4: 0.28, 3: 0.08, 2: 0.03, 1: 0.01 },
      },
      {
        id: '3',
        weights: { 5: 0.28, 4: 0.35, 3: 0.22, 2: 0.1, 1: 0.05 },
      },
      {
        id: '4',
        weights: { 5: 0.48, 4: 0.32, 3: 0.15, 2: 0.04, 1: 0.01 },
      },
    ];

    const targetedMoments = new Map<string, { rating: number; comment: string }>([
      ['3-1', { rating: 2, comment: 'Guest noted the lunch rush felt a bit chaotic.' }],
      ['3-3', { rating: 3, comment: 'Follow-up was better today—appreciated the effort.' }],
      ['1-2', { rating: 5, comment: 'Delivered an exceptional chef’s special presentation.' }],
      ['4-4', { rating: 5, comment: 'Handled a large party with ease and grace.' }],
    ]);

    const usedTargeted = new Set<string>();
    const demoRatings: Rating[] = [];
    const now = new Date();

    for (let day = 0; day < 30; day++) {
      const ratingDate = new Date(now);
      ratingDate.setDate(now.getDate() - day);
      const isWeekend = ratingDate.getDay() === 5 || ratingDate.getDay() === 6;

      for (const profile of waiterProfiles) {
        const baseVolume = day < 7 ? 3 : day < 14 ? 2 : 1;
        const volume = baseVolume + (isWeekend ? 1 : 0);

        for (let index = 0; index < volume; index++) {
          const targetedKey = `${profile.id}-${day}`;
          let ratingValue: number;
          let comment: string | undefined;

          if (!usedTargeted.has(targetedKey) && targetedMoments.has(targetedKey)) {
            const targeted = targetedMoments.get(targetedKey)!;
            ratingValue = targeted.rating;
            comment = targeted.comment;
            usedTargeted.add(targetedKey);
          } else {
            const weights = { ...profile.weights } as Record<number, number>;

            if (profile.id === '3' && day < 5) {
              weights[5] = 0.4;
              weights[4] = 0.35;
              weights[3] = 0.2;
              weights[2] = 0.04;
              weights[1] = 0.01;
            }

            ratingValue = this.pickWeightedRating(weights);

            if (Math.random() < 0.6) {
              const pool = ratingValue >= 4
                ? positiveComments
                : ratingValue === 3
                  ? neutralComments
                  : improvementComments;
              comment = pool[Math.floor(Math.random() * pool.length)];
            }
          }

          const timestamp = new Date(ratingDate);
          timestamp.setHours(11 + Math.floor(Math.random() * 8), Math.floor(Math.random() * 60));

          const rating: Rating = {
            id: `rating_${Date.now()}_${Math.random()}`,
            waiterId: profile.id,
            guestId: `guest_${Date.now()}_${Math.random()}`,
            qrToken: `token_${Date.now()}_${Math.random()}`,
            rating: ratingValue,
            comment,
            tableNumber: `Table ${Math.floor(Math.random() * 20) + 1}`,
            timestamp,
            isVerified: true,
            isFlagged: ratingValue <= 2,
          };

          demoRatings.push(rating);
        }
      }
    }

    for (const rating of demoRatings) {
      await this.storeRating(rating);
    }
  }

  private async createDemoShifts(): Promise<void> {
    const waiters = (await this.getUsers()).filter(user => user.role === 'waiter') as Waiter[];
    if (waiters.length === 0) {
      return;
    }

    const shifts: Shift[] = [];
    const now = new Date();

    for (const waiter of waiters) {
      for (let dayOffset = 0; dayOffset < 4; dayOffset++) {
        const baseDate = new Date(now);
        baseDate.setDate(now.getDate() - dayOffset);
        baseDate.setHours(10, 0, 0, 0);

        const startTime = new Date(baseDate);
        const endTime = new Date(baseDate.getTime() + (6 + Math.floor(Math.random() * 3)) * 60 * 60 * 1000);

        const pointsEarned = Math.floor(80 + Math.random() * 80);
        const ratingsCount = Math.floor(3 + Math.random() * 6);
        const averageRating = Number((4 - Math.random() * 0.5 + Math.random() * 0.5).toFixed(1));

        const shift: Shift = {
          id: `shift_demo_${waiter.id}_${dayOffset}`,
          waiterId: waiter.id,
          startTime,
          endTime,
          isActive: false,
          pointsEarned,
          ratingsCount,
          averageRating,
        };

        shifts.push(shift);
      }
    }

    for (const shift of shifts) {
      await this.storeShift(shift);
    }
  }

  private pickWeightedRating(weights: Record<number, number>): number {
    const orderedRatings = [5, 4, 3, 2, 1];
    const roll = Math.random();
    let cumulative = 0;

    for (const value of orderedRatings) {
      cumulative += weights[value] ?? 0;
      if (roll <= cumulative) {
        return value;
      }
    }

    return 3;
  }

  // Clear all data (for testing)
  async clearAllData(): Promise<void> {
    const keys = [
      'current_user', 'users', 'current_hotel', 'ratings', 
      'qr_codes', 'shifts', 'badges_1', 'badges_2', 'badges_3', 'badges_4',
      'demo_data_version'
    ];

    for (const key of keys) {
      await this.removeItem(key);
    }
  }
}
