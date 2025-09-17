export interface User {
  id: string;
  name: string;
  email: string;
  role: 'waiter' | 'manager' | 'admin';
  hotelId: string;
  avatar?: string;
  isActive: boolean;
  createdAt: Date;
}

export interface Waiter extends User {
  role: 'waiter';
  points: number;
  level: number;
  badges: Badge[];
  currentShiftId?: string;
  totalRatings: number;
  averageRating: number;
}

export interface Manager extends User {
  role: 'manager';
  hotelId: string;
  permissions: string[];
}

export interface Guest {
  id: string;
  sessionId: string;
  rating?: number;
  comment?: string;
  tableNumber?: string;
  lastName?: string;
  timestamp: Date;
  deviceInfo: {
    userAgent: string;
    ip: string;
    location?: {
      latitude: number;
      longitude: number;
    };
  };
}

export interface Rating {
  id: string;
  waiterId: string;
  guestId: string;
  qrToken: string;
  rating: number;
  comment?: string;
  tableNumber?: string;
  timestamp: Date;
  location?: {
    latitude: number;
    longitude: number;
  };
  isVerified: boolean;
  isFlagged: boolean;
  flagReason?: string;
  resolvedAt?: Date;
  resolvedBy?: string;
  resolutionNotes?: string;
}

export interface QRCode {
  id: string;
  waiterId: string;
  shiftId: string;
  token: string;
  url: string;
  isUsed: boolean;
  createdAt: Date;
  expiresAt: Date;
}

export interface Shift {
  id: string;
  waiterId: string;
  startTime: Date;
  endTime?: Date;
  isActive: boolean;
  pointsEarned: number;
  ratingsCount: number;
  averageRating: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  pointsRequired: number;
  category: 'rating' | 'points' | 'consistency' | 'team' | 'special';
  isUnlocked: boolean;
  unlockedAt?: Date;
}

export interface LeaderboardEntry {
  waiterId: string;
  waiterName: string;
  points: number;
  level: number;
  badges: Badge[];
  averageRating: number;
  position: number;
  change: number; // position change from previous period
}

export interface Leaderboard {
  id: string;
  type: 'weekly' | 'monthly' | 'all-time';
  period: string;
  entries: LeaderboardEntry[];
  lastUpdated: Date;
}

export interface Hotel {
  id: string;
  name: string;
  address: string;
  timezone: string;
  settings: {
    pointsPer4Star: number;
    pointsPer5Star: number;
    maxPointsPerShift: number;
    geofencingEnabled: boolean;
    geofenceRadius: number;
    location: {
      latitude: number;
      longitude: number;
    };
  };
}

export interface Notification {
  id: string;
  userId: string;
  type: 'badge' | 'points' | 'leaderboard' | 'alert';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  data?: any;
}

export interface FraudAlert {
  id: string;
  type: 'multiple_ratings' | 'suspicious_location' | 'unusual_pattern' | 'device_abuse';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  affectedRatings: string[];
  detectedAt: Date;
  status: 'pending' | 'investigating' | 'resolved' | 'false_positive';
  resolvedBy?: string;
  resolvedAt?: Date;
}

export interface Analytics {
  totalRatings: number;
  averageRating: number;
  responseRate: number;
  topPerformers: LeaderboardEntry[];
  recentTrends: {
    date: string;
    ratings: number;
    averageRating: number;
  }[];
  fraudAlerts: FraudAlert[];
  guestSatisfaction: {
    excellent: number; // 5 stars
    good: number; // 4 stars
    average: number; // 3 stars
    poor: number; // 2 stars
    terrible: number; // 1 star
  };
}

export interface AppState {
  user: User | null;
  hotel: Hotel | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  currentShift: Shift | null;
  notifications: Notification[];
}

export interface NavigationProps {
  navigation: any;
  route: any;
}
