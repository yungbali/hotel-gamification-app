import { Amplify } from 'aws-amplify';
import awsExports from '../aws-exports';

let isConfigured = false;
const awsConfig = awsExports as any;
const hasAmplifyConfig = Boolean(awsConfig?.API?.GraphQL?.endpoint);

export const configureAmplify = (): void => {
  if (!hasAmplifyConfig || isConfigured) {
    return;
  }

  Amplify.configure(awsConfig);

  isConfigured = true;
};

export const isAmplifyConfigured = (): boolean => isConfigured;

export const shouldUseAmplify = (): boolean => hasAmplifyConfig;
