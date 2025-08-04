import { Injectable, inject, InjectionToken } from '@angular/core';
import { ApiService } from './interfaces/api.interface';
import { ApiConfig } from './models/api-config.model';
import { MockApiService } from './implementations/mock/mock-api.service';
import { FakeApiService } from './implementations/fake-api.service';

export const API_CONFIG = new InjectionToken<ApiConfig>('API_CONFIG');

@Injectable({
  providedIn: 'root',
})
export class ApiFactoryService {
  private readonly config = inject(API_CONFIG, { optional: true }) ?? {
    implementation: 'mock',
  };

  // factory method
  public createApiService(): ApiService {
    switch (this.config.implementation) {
      case 'api':
        return new FakeApiService();
      case 'mock':
      default:
        return new MockApiService();
    }
  }
}
