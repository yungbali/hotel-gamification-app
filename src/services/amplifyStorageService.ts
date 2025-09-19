import { StorageService } from './storageService';

/**
 * Placeholder Amplify storage service. It currently delegates to the existing
 * StorageService so that we can keep the app working while the real AppSync
 * integration is finalized.
 */
export class AmplifyStorageService extends StorageService {
  private static amplifyInstance: AmplifyStorageService;

  private constructor() {
    super();
  }

  static override getInstance(): AmplifyStorageService {
    if (!AmplifyStorageService.amplifyInstance) {
      AmplifyStorageService.amplifyInstance = new AmplifyStorageService();
    }
    return AmplifyStorageService.amplifyInstance;
  }
}
