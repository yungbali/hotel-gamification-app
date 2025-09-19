import { Rating, Guest, QRCode } from '../types';
import { getDataService, DataService } from './dataService';
import { GamificationService } from './gamificationService';

export class FeedbackService {
  private static instance: FeedbackService;
  private storageService: DataService;
  private gamificationService: GamificationService;

  static getInstance(): FeedbackService {
    if (!FeedbackService.instance) {
      FeedbackService.instance = new FeedbackService();
    }
    return FeedbackService.instance;
  }

  constructor() {
    this.storageService = getDataService();
    this.gamificationService = GamificationService.getInstance();
  }

  async submitFeedback(feedbackData: {
    token: string;
    rating: number;
    comment?: string;
    tableNumber?: string;
    lastName?: string;
    timestamp: string;
    deviceInfo: {
      userAgent: string;
      ip: string;
      location?: {
        latitude: number;
        longitude: number;
      };
    };
  }): Promise<{ success: boolean; message: string; pointsAwarded: number }> {
    try {
      // Validate QR code token
      const qrCode = await this.storageService.getQRCodeByToken(feedbackData.token);
      if (!qrCode) {
        throw new Error('Invalid or expired QR code');
      }

      if (qrCode.isUsed) {
        throw new Error('This QR code has already been used');
      }

      if (new Date(qrCode.expiresAt) < new Date()) {
        throw new Error('This QR code has expired');
      }

      // Create rating record
      const rating: Rating = {
        id: `rating_${Date.now()}_${Math.random()}`,
        waiterId: qrCode.waiterId,
        guestId: `guest_${Date.now()}`,
        qrToken: feedbackData.token,
        rating: feedbackData.rating,
        comment: feedbackData.comment,
        tableNumber: feedbackData.tableNumber,
        timestamp: new Date(feedbackData.timestamp),
        location: feedbackData.deviceInfo.location,
        isVerified: true,
        isFlagged: false,
      };

      // Store the rating (this will automatically update waiter stats)
      await this.storageService.storeRating(rating);

      // Mark QR code as used
      qrCode.isUsed = true;
      await this.storageService.storeQRCode(qrCode);

      // Calculate points awarded
      const pointsAwarded = await this.gamificationService.calculatePoints(feedbackData.rating);

      // Check for fraud/anomalies (basic checks)
      await this.performFraudCheck(rating, feedbackData.deviceInfo);

      return {
        success: true,
        message: 'Feedback submitted successfully',
        pointsAwarded
      };

    } catch (error) {
      console.error('Submit feedback error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to submit feedback',
        pointsAwarded: 0
      };
    }
  }

  async validateQRCode(token: string): Promise<{
    isValid: boolean;
    qrCode?: QRCode;
    message?: string;
  }> {
    try {
      const qrCode = await this.storageService.getQRCodeByToken(token);
      
      if (!qrCode) {
        return {
          isValid: false,
          message: 'Invalid QR code'
        };
      }

      if (qrCode.isUsed) {
        return {
          isValid: false,
          message: 'This QR code has already been used'
        };
      }

      if (new Date(qrCode.expiresAt) < new Date()) {
        return {
          isValid: false,
          message: 'This QR code has expired'
        };
      }

      return {
        isValid: true,
        qrCode
      };

    } catch (error) {
      console.error('Validate QR code error:', error);
      return {
        isValid: false,
        message: 'Failed to validate QR code'
      };
    }
  }

  private async performFraudCheck(rating: Rating, deviceInfo: any): Promise<void> {
    // Basic fraud detection - in a real app, this would be more sophisticated
    try {
      // Check for multiple ratings from same IP in short time
      const recentRatings = await this.storageService.getRatingsByDateRange(
        new Date(Date.now() - 60 * 60 * 1000), // Last hour
        new Date()
      );

      // In a real app, you'd check IP addresses
      // For demo, we'll just log suspicious activity
      const suspiciousCount = recentRatings.filter(r => 
        r.waiterId === rating.waiterId && 
        Math.abs(new Date(r.timestamp).getTime() - rating.timestamp.getTime()) < 10 * 60 * 1000
      ).length;

      if (suspiciousCount > 3) {
        console.warn('Potential fraud detected: Multiple ratings in short time', {
          waiterId: rating.waiterId,
          count: suspiciousCount
        });
        
        // In a real app, you might flag this for review
        rating.isFlagged = true;
      }

      // Check for unusually high ratings pattern
      const waiterRatings = await this.storageService.getRatingsByWaiter(rating.waiterId);
      const recentHighRatings = waiterRatings.filter(r => 
        r.rating >= 5 && 
        new Date(r.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000)
      ).length;

      if (recentHighRatings > 10) {
        console.warn('Potential rating manipulation detected', {
          waiterId: rating.waiterId,
          highRatingsToday: recentHighRatings
        });
      }

    } catch (error) {
      console.error('Fraud check error:', error);
      // Don't fail the submission for fraud check errors
    }
  }

  // Listen for ratings from web interface
  startListeningForWebRatings(): void {
    // In a real app, this would listen to a WebSocket or poll an API
    // For demo, we'll check localStorage periodically
    if (typeof window !== 'undefined') {
      const checkForNewRatings = () => {
        try {
          const webRatings = JSON.parse(localStorage.getItem('demo_ratings') || '[]');
          const processedRatings = JSON.parse(localStorage.getItem('processed_ratings') || '[]');
          
          const newRatings = webRatings.filter((rating: any) => 
            !processedRatings.includes(rating.id)
          );

          for (const webRating of newRatings) {
            this.processWebRating(webRating);
            processedRatings.push(webRating.id);
          }

          if (newRatings.length > 0) {
            localStorage.setItem('processed_ratings', JSON.stringify(processedRatings));
          }

        } catch (error) {
          console.error('Error checking for web ratings:', error);
        }
      };

      // Check every 5 seconds
      setInterval(checkForNewRatings, 5000);
      
      // Also listen for the custom event
      window.addEventListener('newRating', (event: any) => {
        this.processWebRating(event.detail);
      });
    }
  }

  private async processWebRating(webRating: any): Promise<void> {
    try {
      // Convert web rating to our Rating format and store it
      await this.storageService.storeRating(webRating);
      
      console.log('Processed web rating:', webRating);
      
      // Trigger UI updates if needed
      window.dispatchEvent(new CustomEvent('ratingProcessed', { detail: webRating }));
      
    } catch (error) {
      console.error('Error processing web rating:', error);
    }
  }

  async getRecentFeedback(waiterId?: string, hours: number = 24): Promise<Rating[]> {
    const startDate = new Date(Date.now() - hours * 60 * 60 * 1000);
    const endDate = new Date();
    
    const ratings = await this.storageService.getRatingsByDateRange(startDate, endDate);
    
    if (waiterId) {
      return ratings.filter(r => r.waiterId === waiterId);
    }
    
    return ratings;
  }

  async getFeedbackStats(waiterId?: string): Promise<{
    totalRatings: number;
    averageRating: number;
    ratingDistribution: { [key: number]: number };
    recentTrend: 'up' | 'down' | 'stable';
  }> {
    const ratings = waiterId 
      ? await this.storageService.getRatingsByWaiter(waiterId)
      : await this.storageService.getRatings();

    const totalRatings = ratings.length;
    const averageRating = totalRatings > 0 
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings 
      : 0;

    // Rating distribution
    const ratingDistribution: { [key: number]: number } = {
      1: 0, 2: 0, 3: 0, 4: 0, 5: 0
    };
    
    ratings.forEach(r => {
      ratingDistribution[r.rating] = (ratingDistribution[r.rating] || 0) + 1;
    });

    // Calculate recent trend (last 7 days vs previous 7 days)
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const recentRatings = ratings.filter(r => new Date(r.timestamp) >= sevenDaysAgo);
    const previousRatings = ratings.filter(r => 
      new Date(r.timestamp) >= fourteenDaysAgo && 
      new Date(r.timestamp) < sevenDaysAgo
    );

    const recentAvg = recentRatings.length > 0 
      ? recentRatings.reduce((sum, r) => sum + r.rating, 0) / recentRatings.length 
      : 0;
    const previousAvg = previousRatings.length > 0 
      ? previousRatings.reduce((sum, r) => sum + r.rating, 0) / previousRatings.length 
      : 0;

    let recentTrend: 'up' | 'down' | 'stable' = 'stable';
    if (recentAvg > previousAvg + 0.1) recentTrend = 'up';
    else if (recentAvg < previousAvg - 0.1) recentTrend = 'down';

    return {
      totalRatings,
      averageRating,
      ratingDistribution,
      recentTrend
    };
  }
}
