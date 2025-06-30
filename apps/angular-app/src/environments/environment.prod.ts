import { ApiConfig } from '@front-lab-nx/ng-api';

/**
 * Production environment configuration
 */
export const environment = {
  production: true,

  /**
   * API configuration
   * In production, we use the fake API implementation that makes real HTTP requests
   */
  api: {
    implementation: 'api',
    baseUrl: 'https://api.example.com',
    version: 'v1',
  } as ApiConfig,
};
