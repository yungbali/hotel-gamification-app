import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';
import { 
  User, 
  Waiter, 
  Hotel, 
  Rating, 
  QRCode, 
  Shift, 
  Badge, 
  Leaderboard, 
  LeaderboardEntry,
  Analytics 
} from '../types';

const client = generateClient<Schema>();

export class AmplifyDataService {
  private static instance: AmplifyDataService;

  static getInstance(): AmplifyDataService {
    if (!AmplifyDataService.instance) {
      AmplifyDataService.instance = new AmplifyDataService();
    }
    return AmplifyDataService.instance;
  }

  // User Operations
  async getUsers(): Promise<User[]> {
    const { data: users } = await client.models.User.list();
    
    return users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as User['role'],
      hotelId: user.hotelId || '',
      isActive: user.isActive,
      createdAt: new Date(user.createdAt),
      updatedAt: user.updatedAt ? new Date(user.updatedAt) : undefined,
    }));
  }

  async storeUser(user: User): Promise<void> {
    const existingUser = await client.models.User.get({ id: user.id });
    
    if (existingUser.data) {
      // Update existing user
      await client.models.User.update({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        hotelId: user.hotelId,
        isActive: user.isActive,
        ...(user.role === 'waiter' && {
          points: (user as Waiter).points,
          level: (user as Waiter).level,
          totalRatings: (user as Waiter).totalRatings,
          averageRating: (user as Waiter).averageRating,
        }),
      });
    } else {
      // Create new user
      await client.models.User.create({
        email: user.email,
        name: user.name,
        role: user.role,
        hotelId: user.hotelId,
        isActive: user.isActive,
        ...(user.role === 'waiter' && {
          points: (user as Waiter).points || 0,
          level: (user as Waiter).level || 1,
          totalRatings: (user as Waiter).totalRatings || 0,
          averageRating: (user as Waiter).averageRating || 0,
        }),
      });
    }
  }

  // Hotel Operations
  async getCurrentHotel(): Promise<Hotel | null> {
    const { data: hotels } = await client.models.Hotel.list();
    
    if (hotels.length === 0) {
      return null;
    }

    const hotel = hotels[0];
    return {
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

  async storeHotel(hotel: Hotel): Promise<void> {
    const existingHotel = await client.models.Hotel.get({ id: hotel.id });
    
    if (existingHotel.data) {
      await client.models.Hotel.update({
        id: hotel.id,
        name: hotel.name,
        address: hotel.address,
        timezone: hotel.timezone,
      });
    } else {
      await client.models.Hotel.create({
        name: hotel.name,
        address: hotel.address,
        timezone: hotel.timezone,
      });
    }
  }

  // Rating Operations
  async storeRating(rating: Rating): Promise<void> {
    await client.models.Rating.create({
      waiterId: rating.waiterId,
      hotelId: rating.hotelId || '',
      rating: rating.rating,
      comment: rating.comment,
      tableNumber: rating.tableNumber,
      guestName: '', // Can be added later
      timestamp: rating.timestamp.toISOString(),
      qrToken: rating.qrToken,
      deviceInfo: rating.location ? JSON.stringify({
        location: rating.location,
        userAgent: 'mobile',
      }) : undefined,
      isFlagged: rating.isFlagged,
      flaggedReason: rating.flagReason,
      isResolved: !!rating.resolvedAt,
      resolvedBy: rating.resolvedBy,
      resolvedAt: rating.resolvedAt?.toISOString(),
      resolutionNotes: rating.resolutionNotes,
    });

    // Update waiter stats
    await this.updateWaiterStats(rating.waiterId);
  }

  async getRatings(): Promise<Rating[]> {
    const { data: ratings } = await client.models.Rating.list();
    
    return ratings.map(rating => ({
      id: rating.id,
      waiterId: rating.waiterId,
      guestId: `guest_${rating.id}`,
      qrToken: rating.qrToken || '',
      rating: rating.rating,
      comment: rating.comment,
      tableNumber: rating.tableNumber,
      timestamp: new Date(rating.timestamp),
      hotelId: rating.hotelId,
      location: rating.deviceInfo ? JSON.parse(rating.deviceInfo as string).location : undefined,
      isVerified: true,
      isFlagged: rating.isFlagged,
      flagReason: rating.flaggedReason,
      resolvedAt: rating.resolvedAt ? new Date(rating.resolvedAt) : undefined,
      resolvedBy: rating.resolvedBy || undefined,
      resolutionNotes: rating.resolutionNotes,
    }));
  }

  async getRatingsByWaiter(waiterId: string): Promise<Rating[]> {
    const { data: ratings } = await client.models.Rating.list({
      filter: { waiterId: { eq: waiterId } }
    });
    
    return ratings.map(rating => ({
      id: rating.id,
      waiterId: rating.waiterId,
      guestId: `guest_${rating.id}`,
      qrToken: rating.qrToken || '',
      rating: rating.rating,
      comment: rating.comment,
      tableNumber: rating.tableNumber,
      timestamp: new Date(rating.timestamp),
      hotelId: rating.hotelId,
      location: rating.deviceInfo ? JSON.parse(rating.deviceInfo as string).location : undefined,
      isVerified: true,
      isFlagged: rating.isFlagged,
      flagReason: rating.flaggedReason,
      resolvedAt: rating.resolvedAt ? new Date(rating.resolvedAt) : undefined,
      resolvedBy: rating.resolvedBy || undefined,
      resolutionNotes: rating.resolutionNotes,
    }));
  }

  // QR Code Operations
  async storeQRCode(qrCode: QRCode): Promise<void> {
    await client.models.QRCode.create({
      waiterId: qrCode.waiterId,
      shiftId: qrCode.shiftId,
      token: qrCode.token,
      url: qrCode.url,
      isUsed: qrCode.isUsed,
      usedAt: qrCode.isUsed ? new Date().toISOString() : undefined,
      expiresAt: qrCode.expiresAt.toISOString(),
    });
  }

  async getQRCodeByToken(token: string): Promise<QRCode | null> {
    const { data: qrCodes } = await client.models.QRCode.list({
      filter: { token: { eq: token } }
    });

    if (qrCodes.length === 0) {
      return null;
    }

    const qrCode = qrCodes[0];
    return {
      id: qrCode.id,
      waiterId: qrCode.waiterId,
      shiftId: qrCode.shiftId,
      token: qrCode.token,
      url: qrCode.url,
      isUsed: qrCode.isUsed,
      createdAt: new Date(qrCode.createdAt),
      expiresAt: new Date(qrCode.expiresAt),
    };
  }

  async getActiveQRCodeByWaiter(waiterId: string): Promise<QRCode | null> {
    const { data: qrCodes } = await client.models.QRCode.list({
      filter: {
        waiterId: { eq: waiterId },
        isUsed: { eq: false }
      }
    });

    // Find the most recent unexpired QR code
    const activeQRCodes = qrCodes.filter(qr => new Date(qr.expiresAt) > new Date());
    
    if (activeQRCodes.length === 0) {
      return null;
    }

    const qrCode = activeQRCodes.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];

    return {
      id: qrCode.id,
      waiterId: qrCode.waiterId,
      shiftId: qrCode.shiftId,
      token: qrCode.token,
      url: qrCode.url,
      isUsed: qrCode.isUsed,
      createdAt: new Date(qrCode.createdAt),
      expiresAt: new Date(qrCode.expiresAt),
    };
  }

  // Shift Operations
  async getShifts(): Promise<Shift[]> {
    const { data: shifts } = await client.models.Shift.list();
    
    return shifts.map(shift => ({
      id: shift.id,
      waiterId: shift.waiterId,
      startTime: new Date(shift.startTime),
      endTime: shift.endTime ? new Date(shift.endTime) : undefined,
      isActive: shift.isActive,
      pointsEarned: shift.pointsEarned || 0,
      ratingsCount: shift.ratingsCount || 0,
      averageRating: shift.averageRating || 0,
      hotelId: shift.hotelId,
    }));
  }

  async createShift(shift: Omit<Shift, 'id'>): Promise<Shift> {
    const { data: newShift } = await client.models.Shift.create({
      waiterId: shift.waiterId,
      hotelId: shift.hotelId || '',
      startTime: shift.startTime.toISOString(),
      endTime: shift.endTime?.toISOString(),
      isActive: shift.isActive,
      pointsEarned: shift.pointsEarned,
      ratingsCount: shift.ratingsCount,
      averageRating: shift.averageRating,
    });

    if (!newShift) {
      throw new Error('Failed to create shift');
    }

    return {
      id: newShift.id,
      waiterId: newShift.waiterId,
      startTime: new Date(newShift.startTime),
      endTime: newShift.endTime ? new Date(newShift.endTime) : undefined,
      isActive: newShift.isActive,
      pointsEarned: newShift.pointsEarned || 0,
      ratingsCount: newShift.ratingsCount || 0,
      averageRating: newShift.averageRating || 0,
      hotelId: newShift.hotelId,
    };
  }

  // Badge Operations
  async getBadgesByWaiter(waiterId: string): Promise<Badge[]> {
    const { data: badges } = await client.models.Badge.list({
      filter: { waiterId: { eq: waiterId } }
    });

    return badges.map(badge => ({
      id: badge.id,
      name: badge.name,
      description: badge.description || '',
      icon: badge.icon || '',
      pointsRequired: 0, // Can be calculated from criteria
      category: 'special' as const,
      isUnlocked: true,
      unlockedAt: new Date(badge.earnedAt),
    }));
  }

  // Analytics and Leaderboards
  async calculateLeaderboard(type: 'weekly' | 'monthly' | 'all-time' = 'weekly'): Promise<Leaderboard> {
    const users = await this.getUsers();
    const waiters = users.filter(u => u.role === 'waiter') as Waiter[];

    // Sort by points (descending)
    waiters.sort((a, b) => b.points - a.points);

    const entries: LeaderboardEntry[] = waiters.map((waiter, index) => ({
      waiterId: waiter.id,
      waiterName: waiter.name,
      points: waiter.points,
      level: waiter.level,
      badges: waiter.badges || [],
      averageRating: waiter.averageRating,
      position: index + 1,
      change: 0, // Would need historical data to calculate
    }));

    return {
      id: `leaderboard_${type}_${Date.now()}`,
      type,
      period: new Date().toISOString().split('T')[0],
      entries,
      lastUpdated: new Date(),
    };
  }

  async calculateAnalytics(period: string = 'week'): Promise<Analytics> {
    const ratings = await this.getRatings();
    const users = await this.getUsers();
    const waiters = users.filter(u => u.role === 'waiter') as Waiter[];

    // Calculate period-specific data
    const now = new Date();
    let startDate: Date;
    
    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(0); // All time
    }

    const periodRatings = ratings.filter(r => r.timestamp >= startDate);
    
    const totalRatings = periodRatings.length;
    const averageRating = totalRatings > 0 
      ? periodRatings.reduce((sum, r) => sum + r.rating, 0) / totalRatings 
      : 0;

    const leaderboard = await this.calculateLeaderboard('weekly');
    const topPerformers = leaderboard.entries.slice(0, 5);

    // Calculate guest satisfaction breakdown
    const guestSatisfaction = {
      excellent: periodRatings.filter(r => r.rating === 5).length,
      good: periodRatings.filter(r => r.rating === 4).length,
      average: periodRatings.filter(r => r.rating === 3).length,
      poor: periodRatings.filter(r => r.rating === 2).length,
      terrible: periodRatings.filter(r => r.rating === 1).length,
    };

    return {
      totalRatings,
      averageRating,
      responseRate: 0.85, // Mock response rate
      topPerformers,
      recentTrends: [], // Would need historical data
      fraudAlerts: [], // Would need fraud detection logic
      guestSatisfaction,
    };
  }

  // Helper method to update waiter statistics
  private async updateWaiterStats(waiterId: string): Promise<void> {
    const ratings = await this.getRatingsByWaiter(waiterId);
    
    const totalRatings = ratings.length;
    const averageRating = totalRatings > 0 
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings 
      : 0;
    
    // Calculate points (4 stars = 10 points, 5 stars = 20 points)
    const points = ratings.reduce((total, r) => {
      if (r.rating === 4) return total + 10;
      if (r.rating === 5) return total + 20;
      return total;
    }, 0);
    
    // Calculate level (every 100 points = 1 level)
    const level = Math.floor(points / 100) + 1;

    await client.models.User.update({
      id: waiterId,
      points,
      level,
      totalRatings,
      averageRating,
    });
  }

  // Real-time subscriptions
  subscribeToRatings(callback: (ratings: Rating[]) => void) {
    const subscription = client.models.Rating.observeQuery().subscribe({
      next: ({ items }) => {
        const ratings = items.map(rating => ({
          id: rating.id,
          waiterId: rating.waiterId,
          guestId: `guest_${rating.id}`,
          qrToken: rating.qrToken || '',
          rating: rating.rating,
          comment: rating.comment,
          tableNumber: rating.tableNumber,
          timestamp: new Date(rating.timestamp),
          hotelId: rating.hotelId,
          location: rating.deviceInfo ? JSON.parse(rating.deviceInfo as string).location : undefined,
          isVerified: true,
          isFlagged: rating.isFlagged,
          flagReason: rating.flaggedReason,
          resolvedAt: rating.resolvedAt ? new Date(rating.resolvedAt) : undefined,
          resolvedBy: rating.resolvedBy || undefined,
          resolutionNotes: rating.resolutionNotes,
        }));
        callback(ratings);
      },
      error: (error) => console.error('Ratings subscription error:', error),
    });

    return subscription;
  }
}
