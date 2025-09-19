import { QRCode } from '../types';
import { getDataService, DataService } from './dataService';

export class QRCodeService {
  private static instance: QRCodeService;
  private storageService: DataService;

  static getInstance(): QRCodeService {
    if (!QRCodeService.instance) {
      QRCodeService.instance = new QRCodeService();
    }
    return QRCodeService.instance;
  }

  constructor() {
    this.storageService = getDataService();
  }

  async generateQRCode(waiterId: string, shiftId: string): Promise<QRCode> {
    try {
      const token = this.generateUniqueToken();
      // Use environment-based URL
      const baseUrl = process.env.NODE_ENV === 'production'
        ? 'https://yungbali.github.io/hotel-gamification-app' // GitHub Pages
        : 'http://localhost:3001';
      const url = `${baseUrl}/feedback/${token}`;

      const qrCode: QRCode = {
        id: `qr_${Date.now()}`,
        waiterId,
        shiftId,
        token,
        url,
        isUsed: false,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      };

      await this.storageService.storeQRCode(qrCode);

      return qrCode;
    } catch (error) {
      console.error('Generate QR code error:', error);
      throw error;
    }
  }

  async getQRCode(token: string): Promise<QRCode | null> {
    return this.storageService.getQRCodeByToken(token);
  }

  async getActiveQRCode(waiterId: string): Promise<QRCode | null> {
    return this.storageService.getActiveQRCodeByWaiter(waiterId);
  }

  async markQRCodeAsUsed(token: string): Promise<void> {
    const qrCode = await this.storageService.getQRCodeByToken(token);
    if (!qrCode) {
      return;
    }

    qrCode.isUsed = true;
    await this.storageService.storeQRCode(qrCode);
  }

  async validateQRCode(token: string): Promise<{ isValid: boolean; qrCode?: QRCode }> {
    const qrCode = await this.getQRCode(token);

    if (!qrCode) {
      return { isValid: false };
    }

    if (qrCode.isUsed) {
      return { isValid: false };
    }

    if (new Date() > new Date(qrCode.expiresAt)) {
      return { isValid: false };
    }

    return { isValid: true, qrCode };
  }

  private generateUniqueToken(): string {
    const timestamp = Date.now().toString(36);
    const randomString = Math.random().toString(36).substring(2, 15);
    return `${timestamp}_${randomString}`;
  }

  // Mock helpers kept for compatibility with existing screens
  async mockGenerateQRCode(waiterId: string, shiftId: string): Promise<QRCode> {
    return this.generateQRCode(waiterId, shiftId);
  }

  async mockValidateQRCode(token: string): Promise<{ isValid: boolean; qrCode?: QRCode }> {
    return this.validateQRCode(token);
  }
}
