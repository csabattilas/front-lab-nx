import { Provider } from '@angular/core';
import { API_CONFIG } from '../api-factory.service';
import { ApiConfig } from '../models/api-config.model';
import { NgApiService } from '../ng-api.service';
import { ApiFactoryService } from '../api-factory.service';

/**
 * Provides configuration and services for the NgApi
 * @param config API configuration options
 * @returns Providers for NgApi configuration and services
 */
export function provideNgApi(config: ApiConfig): Provider[] {
  return [
    {
      provide: API_CONFIG,
      useValue: config,
    },
    NgApiService,
    ApiFactoryService,
  ];
}
