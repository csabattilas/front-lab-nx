import { ApiConfig } from '@frontlab/ng-api';

export const environment = {
  production: false,
  api: {
    implementation: 'mock',
    mockDelay: 500,
  } as ApiConfig,
};
