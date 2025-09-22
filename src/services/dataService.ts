import { shouldUseAmplify } from './amplifyClient';
import { AmplifyDataService } from './amplifyDataService';
import { AmplifyStorageService } from './amplifyStorageService';
import { StorageService } from './storageService';

export type DataService = StorageService | AmplifyDataService;

export const getDataService = (): DataService => {
  return shouldUseAmplify()
    ? AmplifyDataService.getInstance()
    : StorageService.getInstance();
};
