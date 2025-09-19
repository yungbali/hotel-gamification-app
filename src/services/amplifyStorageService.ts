import { generateClient } from 'aws-amplify/api';
import type { Schema } from '../../amplify/data/resource';
import { shouldUseAmplify, isAmplifyConfigured } from './amplifyClient';
import { StorageService } from './storageService';
import { 
  User, Hotel, QRCode, Rating, Shift, Badge, 
  Leaderboard, LeaderboardEntry, Analytics 
} from '../types';
import {
  listUsers, getUser, listRatings, getRating, listQRCodes,
  listShifts, getShift, listBadges, listHotels, getHotel
} from './graphql/queries';
import {
  createUser, updateUser, createRating, updateRating, deleteRating,
  createQRCode, updateQRCode, createShift, updateShift,
  createBadge, createHotel, updateHotel
} from './graphql/mutations';

export class AmplifyStorageService {
  private static instance: AmplifyStorageService;
  private localStorageService: StorageService;
  private client: ReturnType<typeof generateClient<Schema>> | null = null;

  static getInstance(): AmplifyStorageService {
    if (!AmplifyStorageService.instance) {
      AmplifyStorageService.instance = new AmplifyStorageService();
    }
    return AmplifyStorageService.instance;
  }

  constructor() {
    this.localStorageService = StorageService.getInstance();
    if (isAmplifyConfigured()) {
      this.client = generateClient<Schema>();
    }
  }

  private async executeWithFallback<T>(
    amplifyOperation: () => Promise<T>,
    localOperation: () => Promise<T>
  ): Promise<T> {
    if (shouldUseAmplify() && this.client) {
      try {
        return await amplifyOperation();
      } catch (error) {
        console.warn('Amplify operation failed, falling back to local storage:', error);
        return await localOperation();
      }
    }
    return await localOperation();
  }

  // User Management
  async storeUser(user: User): Promise<void> {
    return this.executeWithFallback(
      async () => {
        if (!this.client) throw new Error('Amplify not configured');
        
        const existingUser = await this.client.graphql({
          query: getUser,
          variables: { id: user.id }
        });

        if (existingUser.data.getUser) {
          await this.client.graphql({
            query: updateUser,
            variables: {
              input: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                hotelId: user.hotelId,
                points: user.points,
                level: user.level,
                totalRatings: user.totalRatings,
                averageRating: user.averageRating,
                isActive: user.isActive,
              }
            }
          });
        } else {
          await this.client.graphql({
            query: createUser,
            variables: {
              input: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                hotelId: user.hotelId,
                points: user.points || 0,
                level: user.level || 1,
                totalRatings: user.totalRatings || 0,
                averageRating: user.averageRating || 0,
                isActive: user.isActive !== false,
              }
            }
          });
        }
      },
      () => this.localStorageService.storeUser(user)
    );
  }

  async getUsers(): Promise<User[]> {
    return this.executeWithFallback(
      async () => {
        if (!this.client) throw new Error('Amplify not configured');
        
        const result = await this.client.graphql({
          query: listUsers
        });
        
        return result.data.listUsers.items.map(item => ({
          id: item.id,
          email: item.email,
          name: item.name,
          role: item.role as 'waiter' | 'manager' | 'admin',
          hotelId: item.hotelId,
          points: item.points || 0,
          level: item.level || 1,
          totalRatings: item.totalRatings || 0,
          averageRating: item.averageRating || 0,
          isActive: item.isActive !== false,
          createdAt: new Date(item.createdAt),
          updatedAt: new Date(item.updatedAt),
        }));
      },
      () => this.localStorageService.getUsers()
    );
  }

  async getUserById(userId: string): Promise<User | null> {
    return this.executeWithFallback(
      async () => {
        if (!this.client) throw new Error('Amplify not configured');
        
        const result = await this.client.graphql({
          query: getUser,
          variables: { id: userId }
        });
        
        const item = result.data.getUser;
        if (!item) return null;
        
        return {
          id: item.id,
          email: item.email,
          name: item.name,
          role: item.role as 'waiter' | 'manager' | 'admin',
          hotelId: item.hotelId,
          points: item.points || 0,
          level: item.level || 1,
          totalRatings: item.totalRatings || 0,
          averageRating: item.averageRating || 0,
          isActive: item.isActive !== false,
          createdAt: new Date(item.createdAt),
          updatedAt: new Date(item.updatedAt),
        };
      },
      () => this.localStorageService.getUserById(userId)
    );
  }

  // Rating Management
  async storeRating(rating: Rating): Promise<void> {
    return this.executeWithFallback(
      async () => {
        if (!this.client) throw new Error('Amplify not configured');
        
        await this.client.graphql({
          query: createRating,
          variables: {
            input: {
              id: rating.id,
              waiterId: rating.waiterId,
              hotelId: rating.hotelId,
              rating: rating.rating,
              serviceRating: rating.serviceRating,
              foodRating: rating.foodRating,
              ambianceRating: rating.ambianceRating,
              comment: rating.comment,
              tableNumber: rating.tableNumber,
              guestName: rating.guestName,
              timestamp: rating.timestamp.toISOString(),
              qrToken: rating.qrToken,
              deviceInfo: rating.deviceInfo ? JSON.stringify(rating.deviceInfo) : undefined,
              isFlagged: rating.isFlagged || false,
              flaggedReason: rating.flaggedReason,
              isResolved: rating.isResolved || false,
              resolvedBy: rating.resolvedBy,
              resolvedAt: rating.resolvedAt?.toISOString(),
              resolutionNotes: rating.resolutionNotes,
            }
          }
        });
        
        // Update waiter stats
        await this.updateWaiterStats(rating.waiterId);
      },
      () => this.localStorageService.storeRating(rating)
    );
  }

  async getRatings(): Promise<Rating[]> {
    return this.executeWithFallback(
      async () => {
        if (!this.client) throw new Error('Amplify not configured');
        
        const result = await this.client.graphql({
          query: listRatings
        });
        
        return result.data.listRatings.items.map(item => ({
          id: item.id,
          waiterId: item.waiterId,
          hotelId: item.hotelId,
          rating: item.rating,
          serviceRating: item.serviceRating,
          foodRating: item.foodRating,
          ambianceRating: item.ambianceRating,
          comment: item.comment,
          tableNumber: item.tableNumber,
          guestName: item.guestName,
          timestamp: new Date(item.timestamp),
          qrToken: item.qrToken,
          deviceInfo: item.deviceInfo ? JSON.parse(item.deviceInfo as string) : undefined,
          isFlagged: item.isFlagged || false,
          flaggedReason: item.flaggedReason,
          isResolved: item.isResolved || false,
          resolvedBy: item.resolvedBy,
          resolvedAt: item.resolvedAt ? new Date(item.resolvedAt) : undefined,
          resolutionNotes: item.resolutionNotes,
        }));
      },
      () => this.localStorageService.getRatings()
    );
  }

  async deleteRating(ratingId: string): Promise<void> {
    return this.executeWithFallback(
      async () => {
        if (!this.client) throw new Error('Amplify not configured');
        
        const rating = await this.getRatingById(ratingId);
        if (rating) {
          await this.client.graphql({
            query: deleteRating,
            variables: {
              input: { id: ratingId }
            }
          });
          
          // Update waiter stats
          await this.updateWaiterStats(rating.waiterId);
        }
      },
      () => this.localStorageService.deleteRating(ratingId)
    );
  }

  async getRatingById(ratingId: string): Promise<Rating | null> {
    return this.executeWithFallback(
      async () => {
        if (!this.client) throw new Error('Amplify not configured');
        
        const result = await this.client.graphql({
          query: getRating,
          variables: { id: ratingId }
        });
        
        const item = result.data.getRating;
        if (!item) return null;
        
        return {
          id: item.id,
          waiterId: item.waiterId,
          hotelId: item.hotelId,
          rating: item.rating,
          serviceRating: item.serviceRating,
          foodRating: item.foodRating,
          ambianceRating: item.ambianceRating,
          comment: item.comment,
          tableNumber: item.tableNumber,
          guestName: item.guestName,
          timestamp: new Date(item.timestamp),
          qrToken: item.qrToken,
          deviceInfo: item.deviceInfo ? JSON.parse(item.deviceInfo as string) : undefined,
          isFlagged: item.isFlagged || false,
          flaggedReason: item.flaggedReason,
          isResolved: item.isResolved || false,
          resolvedBy: item.resolvedBy,
          resolvedAt: item.resolvedAt ? new Date(item.resolvedAt) : undefined,
          resolutionNotes: item.resolutionNotes,
        };
      },
      () => this.localStorageService.getRatingById(ratingId)
    );
  }

  // QR Code Management
  async storeQRCode(qrCode: QRCode): Promise<void> {
    return this.executeWithFallback(
      async () => {
        if (!this.client) throw new Error('Amplify not configured');
        
        await this.client.graphql({
          query: createQRCode,
          variables: {
            input: {
              id: qrCode.id,
              waiterId: qrCode.waiterId,
              shiftId: qrCode.shiftId,
              token: qrCode.token,
              url: qrCode.url,
              isUsed: qrCode.isUsed || false,
              usedAt: qrCode.usedAt?.toISOString(),
              expiresAt: qrCode.expiresAt.toISOString(),
            }
          }
        });
      },
      () => this.localStorageService.storeQRCode(qrCode)
    );
  }

  async getQRCodes(): Promise<QRCode[]> {
    return this.executeWithFallback(
      async () => {
        if (!this.client) throw new Error('Amplify not configured');
        
        const result = await this.client.graphql({
          query: listQRCodes
        });
        
        return result.data.listQRCodes.items.map(item => ({
          id: item.id,
          waiterId: item.waiterId,
          shiftId: item.shiftId,
          token: item.token,
          url: item.url,
          isUsed: item.isUsed || false,
          usedAt: item.usedAt ? new Date(item.usedAt) : undefined,
          expiresAt: new Date(item.expiresAt),
          createdAt: new Date(item.createdAt),
        }));
      },
      () => this.localStorageService.getQRCodes()
    );
  }

  // Shift Management
  async storeShift(shift: Shift): Promise<void> {
    return this.executeWithFallback(
      async () => {
        if (!this.client) throw new Error('Amplify not configured');
        
        const existingShift = await this.client.graphql({
          query: getShift,
          variables: { id: shift.id }
        });

        if (existingShift.data.getShift) {
          await this.client.graphql({
            query: updateShift,
            variables: {
              input: {
                id: shift.id,
                waiterId: shift.waiterId,
                hotelId: shift.hotelId,
                startTime: shift.startTime.toISOString(),
                endTime: shift.endTime?.toISOString(),
                isActive: shift.isActive !== false,
                pointsEarned: shift.pointsEarned || 0,
                ratingsCount: shift.ratingsCount || 0,
                averageRating: shift.averageRating || 0,
                totalTips: shift.totalTips || 0,
              }
            }
          });
        } else {
          await this.client.graphql({
            query: createShift,
            variables: {
              input: {
                id: shift.id,
                waiterId: shift.waiterId,
                hotelId: shift.hotelId,
                startTime: shift.startTime.toISOString(),
                endTime: shift.endTime?.toISOString(),
                isActive: shift.isActive !== false,
                pointsEarned: shift.pointsEarned || 0,
                ratingsCount: shift.ratingsCount || 0,
                averageRating: shift.averageRating || 0,
                totalTips: shift.totalTips || 0,
              }
            }
          });
        }
      },
      () => this.localStorageService.storeShift(shift)
    );
  }

  async getShifts(): Promise<Shift[]> {
    return this.executeWithFallback(
      async () => {
        if (!this.client) throw new Error('Amplify not configured');
        
        const result = await this.client.graphql({
          query: listShifts
        });
        
        return result.data.listShifts.items.map(item => ({
          id: item.id,
          waiterId: item.waiterId,
          hotelId: item.hotelId,
          startTime: new Date(item.startTime),
          endTime: item.endTime ? new Date(item.endTime) : undefined,
          isActive: item.isActive !== false,
          pointsEarned: item.pointsEarned || 0,
          ratingsCount: item.ratingsCount || 0,
          averageRating: item.averageRating || 0,
          totalTips: item.totalTips || 0,
        }));
      },
      () => this.localStorageService.getShifts()
    );
  }

  // Helper Methods
  async updateWaiterStats(waiterId: string): Promise<void> {
    return this.executeWithFallback(
      async () => {
        // For Amplify, we can use custom resolvers or Lambda functions
        // For now, delegate to local storage service
        return await this.localStorageService.updateWaiterStats(waiterId);
      },
      () => this.localStorageService.updateWaiterStats(waiterId)
    );
  }

  async calculateLeaderboard(type: 'weekly' | 'monthly' | 'all-time' = 'weekly'): Promise<Leaderboard> {
    return this.executeWithFallback(
      async () => {
        // For Amplify, we can implement custom resolvers
        // For now, delegate to local storage service
        return await this.localStorageService.calculateLeaderboard(type);
      },
      () => this.localStorageService.calculateLeaderboard(type)
    );
  }

  // Delegate other methods to local storage service
  async initializeDemoData(): Promise<void> {
    return this.localStorageService.initializeDemoData();
  }

  async getQRCodeByToken(token: string): Promise<QRCode | null> {
    return this.executeWithFallback(
      async () => {
        const qrCodes = await this.getQRCodes();
        return qrCodes.find(qr => qr.token === token) || null;
      },
      () => this.localStorageService.getQRCodeByToken(token)
    );
  }

  async getActiveQRCodeByWaiter(waiterId: string): Promise<QRCode | null> {
    return this.executeWithFallback(
      async () => {
        const qrCodes = await this.getQRCodes();
        return qrCodes.find(qr => 
          qr.waiterId === waiterId && 
          !qr.isUsed && 
          new Date(qr.expiresAt) > new Date()
        ) || null;
      },
      () => this.localStorageService.getActiveQRCodeByWaiter(waiterId)
    );
  }

  async getActiveShiftByWaiter(waiterId: string): Promise<Shift | null> {
    return this.executeWithFallback(
      async () => {
        const shifts = await this.getShifts();
        return shifts.find(s => s.waiterId === waiterId && s.isActive) || null;
      },
      () => this.localStorageService.getActiveShiftByWaiter(waiterId)
    );
  }

  async endShift(shiftId: string): Promise<void> {
    return this.executeWithFallback(
      async () => {
        const shifts = await this.getShifts();
        const shift = shifts.find(s => s.id === shiftId);
        if (shift) {
          shift.isActive = false;
          shift.endTime = new Date();
          await this.storeShift(shift);
        }
      },
      () => this.localStorageService.endShift(shiftId)
    );
  }

  // Passthrough methods for compatibility
  async clearUser(): Promise<void> {
    return this.localStorageService.clearUser();
  }

  async setCurrentUser(user: User): Promise<void> {
    return this.localStorageService.setCurrentUser(user);
  }

  async getCurrentUser(): Promise<User | null> {
    return this.localStorageService.getCurrentUser();
  }

  async setCurrentHotel(hotel: Hotel): Promise<void> {
    return this.localStorageService.setCurrentHotel(hotel);
  }

  async getCurrentHotel(): Promise<Hotel | null> {
    return this.localStorageService.getCurrentHotel();
  }

  async getBadgesByWaiter(waiterId: string): Promise<Badge[]> {
    return this.localStorageService.getBadgesByWaiter(waiterId);
  }
}
