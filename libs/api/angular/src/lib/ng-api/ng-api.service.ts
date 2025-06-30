import { Injectable, inject } from '@angular/core';
import { ApiFactoryService } from './api-factory.service';
import { ApiService } from './interfaces/api.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NgApiService implements ApiService {
  private apiFactoryService = inject(ApiFactoryService);
  private apiService = this.apiFactoryService.createApiService();

  get<T>(endpoint: string, params?: Record<string, string>): Observable<T> {
    return this.apiService.get<T>(endpoint, params);
  }
}
