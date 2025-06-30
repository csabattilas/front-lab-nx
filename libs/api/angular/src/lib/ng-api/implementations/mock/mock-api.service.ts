import { Injectable, inject } from '@angular/core';
import { API_CONFIG } from '../../api-factory.service';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ApiService } from '../../interfaces/api.interface';
import { MOCK_DATA } from './mock-data';

@Injectable()
export class MockApiService implements ApiService {
  private readonly config = inject(API_CONFIG, { optional: true }) || {
    mockDelay: 300,
  };

  get<T>(endpoint: string): Observable<T> {
    const data = this.getMockData<T>(endpoint);

    return of(data).pipe(delay(this.config.mockDelay ?? 100));
  }

  private getMockData<T>(endpoint: string): T {
    const data = MOCK_DATA[endpoint];

    if (data === undefined) {
      throw new Error(`No mock data available for endpoint: ${endpoint}`);
    }

    return data as T;
  }
}
