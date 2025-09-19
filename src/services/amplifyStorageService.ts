import { generateClient, GraphQLResult } from 'aws-amplify/api-graphql';
import { StorageService } from './storageService';
import type { User, Rating, QRCode, Shift } from '../types';
import * as APITypes from './graphql/API';
import { getUser, getQRCode, listUsers, listRatings, listQRCodes, listShifts } from './graphql/queries';
import { createUser, updateUser, createRating, createQRCode, updateQRCode, createShift } from './graphql/mutations';

const client = generateClient();

/**
 * Amplify-aware storage service. It first tries to persist/fetch data via AppSync
 * and falls back to the local StorageService implementation if anything fails.
 */
export class AmplifyStorageService extends StorageService {
  private static amplifyInstance: AmplifyStorageService;
  private fallback = StorageService.getInstance();

  private constructor() {
    super();
  }

  static override getInstance(): AmplifyStorageService {
    if (!AmplifyStorageService.amplifyInstance) {
      AmplifyStorageService.amplifyInstance = new AmplifyStorageService();
    }
    return AmplifyStorageService.amplifyInstance;
  }

  private async withFallback<T>(operation: () => Promise<T>, fallback: () => Promise<T>): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      console.warn('[AmplifyStorageService] falling back to local storage:', error);
      return fallback();
    }
  }

  // Helpers to map API responses into local models
  private mapUser(item: APITypes.User | null | undefined): User | null {
    if (!item) return null;
    return {
      id: item.id,
      name: item.name ?? '',
      email: item.email ?? '',
      role: (item.role ?? 'waiter') as User['role'],
      hotelId: item.hotelId ?? 'default_hotel',
      avatar: undefined,
      isActive: item.isActive ?? true,
      createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
      updatedAt: item.updatedAt ? new Date(item.updatedAt) : undefined,
    };
  }

  private mapRating(item: APITypes.Rating | null | undefined): Rating | null {
    if (!item) return null;
    let parsedLocation: Rating['location'];
    if (item.deviceInfo) {
      try {
        parsedLocation = JSON.parse(item.deviceInfo);
      } catch (error) {
        parsedLocation = undefined;
      }
    }

    return {
      id: item.id,
      waiterId: item.waiterId,
      guestId: item.guestName || `guest-${item.id}`,
      qrToken: item.qrToken ?? '',
      rating: item.rating ?? 0,
      comment: item.comment ?? undefined,
      tableNumber: item.tableNumber ?? undefined,
      timestamp: item.timestamp ? new Date(item.timestamp) : new Date(),
       hotelId: item.hotelId,
      isVerified: true,
      isFlagged: item.isFlagged ?? false,
      location: parsedLocation,
      flagReason: item.flaggedReason ?? undefined,
      resolvedAt: item.resolvedAt ? new Date(item.resolvedAt) : undefined,
      resolvedBy: item.resolvedBy ?? undefined,
      resolutionNotes: item.resolutionNotes ?? undefined,
    };
  }

  private mapQRCode(item: APITypes.QRCode | null | undefined): QRCode | null {
    if (!item) return null;
    return {
      id: item.id,
      waiterId: item.waiterId,
      shiftId: item.shiftId,
      token: item.token,
      url: item.url,
      isUsed: item.isUsed ?? false,
      createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
      expiresAt: item.expiresAt ? new Date(item.expiresAt) : new Date(),
    };
  }

  private mapShift(item: APITypes.Shift | null | undefined): Shift | null {
    if (!item) return null;
    return {
      id: item.id,
      waiterId: item.waiterId,
      startTime: item.startTime ? new Date(item.startTime) : new Date(),
      endTime: item.endTime ? new Date(item.endTime) : undefined,
      isActive: item.isActive ?? true,
      pointsEarned: item.pointsEarned ?? 0,
      ratingsCount: item.ratingsCount ?? 0,
      averageRating: item.averageRating ?? 0,
      hotelId: item.hotelId ?? 'default_hotel',
    };
  }

  override async storeUser(user: User): Promise<void> {
    await this.withFallback(async () => {
      const existing = await client.graphql({
        query: getUser,
        variables: { id: user.id },
        authMode: 'AMAZON_COGNITO_USER_POOLS',
      }) as GraphQLResult<APITypes.GetUserQuery>;

      const input = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        hotelId: user.hotelId,
        isActive: user.isActive,
      };

      if (existing.data?.getUser) {
        await client.graphql({ query: updateUser, variables: { input }, authMode: 'AMAZON_COGNITO_USER_POOLS' });
      } else {
        await client.graphql({ query: createUser, variables: { input }, authMode: 'AMAZON_COGNITO_USER_POOLS' });
      }
    }, () => super.storeUser(user));

    await super.storeUser(user);
  }

  override async getUsers(): Promise<User[]> {
    return this.withFallback(async () => {
      const result = await client.graphql({ query: listUsers, authMode: 'AMAZON_COGNITO_USER_POOLS' }) as GraphQLResult<APITypes.ListUsersQuery>;
      const items = result.data?.listUsers?.items ?? [];
      return items
        .map(item => this.mapUser(item))
        .filter((item): item is User => Boolean(item));
    }, () => super.getUsers());
  }

  override async storeRating(rating: Rating): Promise<void> {
    await this.withFallback(async () => {
      const hotel = await super.getCurrentHotel();
      const hotelId = rating.hotelId ?? hotel?.id ?? 'default_hotel';

      await client.graphql({
        query: createRating,
        variables: {
          input: {
            id: rating.id,
            waiterId: rating.waiterId,
            hotelId,
            rating: rating.rating,
            comment: rating.comment,
            tableNumber: rating.tableNumber,
            guestName: rating.guestId,
            timestamp: rating.timestamp.toISOString(),
            qrToken: rating.qrToken,
            isFlagged: rating.isFlagged,
            location: rating.location as any,
            resolutionNotes: rating.resolutionNotes,
            resolvedAt: rating.resolvedAt?.toISOString(),
            resolvedBy: rating.resolvedBy,
          },
        },
        authMode: 'AMAZON_COGNITO_USER_POOLS',
      });
    }, () => super.storeRating(rating));

    await super.storeRating(rating);
  }

  override async getRatings(): Promise<Rating[]> {
    return this.withFallback(async () => {
      const result = await client.graphql({ query: listRatings, authMode: 'AMAZON_COGNITO_USER_POOLS' }) as GraphQLResult<APITypes.ListRatingsQuery>;
      const items = result.data?.listRatings?.items ?? [];
      return items
        .map(item => this.mapRating(item))
        .filter((item): item is Rating => Boolean(item));
    }, () => super.getRatings());
  }

  override async storeQRCode(qrCode: QRCode): Promise<void> {
    await this.withFallback(async () => {
      const existing = await client.graphql({
        query: getQRCode,
        variables: { id: qrCode.id },
        authMode: 'AMAZON_COGNITO_USER_POOLS',
      }) as GraphQLResult<APITypes.GetQRCodeQuery>;

      const input = {
        id: qrCode.id,
        waiterId: qrCode.waiterId,
        shiftId: qrCode.shiftId,
        token: qrCode.token,
        url: qrCode.url,
        isUsed: qrCode.isUsed,
        createdAt: qrCode.createdAt.toISOString(),
        expiresAt: qrCode.expiresAt.toISOString(),
      };

      if (existing.data?.getQRCode) {
        await client.graphql({ query: updateQRCode, variables: { input }, authMode: 'AMAZON_COGNITO_USER_POOLS' });
      } else {
        await client.graphql({ query: createQRCode, variables: { input }, authMode: 'AMAZON_COGNITO_USER_POOLS' });
      }
    }, () => super.storeQRCode(qrCode));

    await super.storeQRCode(qrCode);
  }

  override async getQRCodes(): Promise<QRCode[]> {
    return this.withFallback(async () => {
      const result = await client.graphql({ query: listQRCodes, authMode: 'AMAZON_COGNITO_USER_POOLS' }) as GraphQLResult<APITypes.ListQRCodesQuery>;
      const items = result.data?.listQRCodes?.items ?? [];
      return items.map(item => this.mapQRCode(item)!).filter((item): item is QRCode => Boolean(item));
    }, () => super.getQRCodes());
  }

  override async getShifts(): Promise<Shift[]> {
    return this.withFallback(async () => {
      const result = await client.graphql({ query: listShifts, authMode: 'AMAZON_COGNITO_USER_POOLS' }) as GraphQLResult<APITypes.ListShiftsQuery>;
      const items = result.data?.listShifts?.items ?? [];
      return items
        .map(item => this.mapShift(item))
        .filter((item): item is Shift => Boolean(item));
    }, () => super.getShifts());
  }

  override async storeShift(shift: Shift): Promise<void> {
    await this.withFallback(async () => {
      const hotel = await super.getCurrentHotel();
      const hotelId = shift.hotelId ?? hotel?.id ?? 'default_hotel';

      await client.graphql({
        query: createShift,
        variables: {
          input: {
            id: shift.id,
            waiterId: shift.waiterId,
            hotelId,
            startTime: shift.startTime.toISOString(),
            endTime: shift.endTime?.toISOString(),
            isActive: shift.isActive,
            pointsEarned: shift.pointsEarned,
            ratingsCount: shift.ratingsCount,
            averageRating: shift.averageRating,
          },
        },
        authMode: 'AMAZON_COGNITO_USER_POOLS',
      });
    }, () => super.storeShift(shift));

    await super.storeShift(shift);
  }
}
