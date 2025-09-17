// Mock backend service for development
export class BackendService {
  private static instance: BackendService;
  private baseUrl = 'https://api.hotel-gamification.com'; // Replace with actual API

  static getInstance(): BackendService {
    if (!BackendService.instance) {
      BackendService.instance = new BackendService();
    }
    return BackendService.instance;
  }

  // Mock API endpoints for development
  async submitFeedback(data: any) {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Mock API: Submitting feedback', data);
    return {
      success: true,
      message: 'Feedback submitted successfully',
      pointsAwarded: data.rating >= 4 ? (data.rating === 4 ? 10 : 20) : 0,
    };
  }

  async getWaiterStats(waiterId: string) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      waiterId,
      totalPoints: 450,
      level: 3,
      totalRatings: 45,
      averageRating: 4.2,
      badges: [],
    };
  }

  async getLeaderboard(type: 'weekly' | 'monthly' | 'all-time') {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      type,
      entries: [
        {
          waiterId: '1',
          waiterName: 'John Smith',
          points: 450,
          level: 3,
          badges: [],
          averageRating: 4.2,
          position: 1,
          change: 0,
        },
        {
          waiterId: '2',
          waiterName: 'Sarah Johnson',
          points: 380,
          level: 3,
          badges: [],
          averageRating: 4.1,
          position: 2,
          change: 1,
        },
        {
          waiterId: '3',
          waiterName: 'Mike Wilson',
          points: 320,
          level: 2,
          badges: [],
          averageRating: 3.9,
          position: 3,
          change: -1,
        },
      ],
      lastUpdated: new Date(),
    };
  }

  async getAnalytics(period: string) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      totalRatings: 156,
      averageRating: 4.2,
      responseRate: 32,
      guestSatisfaction: {
        excellent: 65,
        good: 25,
        average: 8,
        poor: 2,
        terrible: 0,
      },
      fraudAlerts: [],
      topPerformers: [],
      recentTrends: [],
    };
  }

  // Geofencing and fraud detection
  async validateLocation(latitude: number, longitude: number, hotelLocation: any) {
    // Simple distance calculation (in a real app, use proper geolocation library)
    const distance = this.calculateDistance(
      latitude,
      longitude,
      hotelLocation.latitude,
      hotelLocation.longitude
    );
    
    return {
      isValid: distance <= hotelLocation.radius,
      distance,
    };
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // Radius of the Earth in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance * 1000; // Convert to meters
  }

  private deg2rad(deg: number) {
    return deg * (Math.PI / 180);
  }

  // Rate limiting
  async checkRateLimit(deviceId: string, timeframe: string) {
    // Mock rate limiting - in a real app, this would check against a database
    return {
      allowed: true,
      remaining: 10,
      resetTime: new Date(Date.now() + 3600000), // 1 hour from now
    };
  }

  // Anomaly detection
  async detectAnomalies(ratingData: any) {
    const anomalies = [];
    
    // Check for unusual patterns
    if (ratingData.ratingCount > 10) {
      anomalies.push({
        type: 'high_frequency',
        severity: 'medium',
        description: 'Unusually high number of ratings',
      });
    }
    
    if (ratingData.averageRating > 4.8) {
      anomalies.push({
        type: 'suspicious_rating',
        severity: 'high',
        description: 'Unusually high average rating',
      });
    }
    
    return anomalies;
  }
}
