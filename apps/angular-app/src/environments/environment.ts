import { ApiConfig } from '@front-lab-nx/ng-api';

export const environment = {
  production: false,
  api: {
    implementation: 'mock',
    mockDelay: 500,
  } as ApiConfig,
};
