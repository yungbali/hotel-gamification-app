import { shouldUseAmplify } from './amplifyClient';
import { AmplifyStorageService } from './amplifyStorageService';
import { StorageService } from './storageService';

export type DataService = StorageService;

export const getDataService = (): DataService => {
  return shouldUseAmplify()
    ? AmplifyStorageService.getInstance()
    : StorageService.getInstance();
};
