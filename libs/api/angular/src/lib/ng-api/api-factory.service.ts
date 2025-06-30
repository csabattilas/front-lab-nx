import { HttpClient } from '@angular/common/http';
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
  private http = inject(HttpClient);
  private config = inject(API_CONFIG, { optional: true }) || {
    implementation: 'mock',
  };

  // factory method
  createApiService(): ApiService {
    switch (this.config.implementation) {
      case 'api':
        return new FakeApiService();
      case 'mock':
      default:
        return new MockApiService();
    }
  }
}
