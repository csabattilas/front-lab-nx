import { Injectable, inject } from '@angular/core';
import { API_CONFIG } from '../api-factory.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../interfaces/api.interface';

// i will use this later for other possible frontend component ideas
@Injectable({
  providedIn: 'root',
})
export class FakeApiService implements ApiService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(API_CONFIG);

  private baseUrl = this.config.baseUrl || 'https://api.example.com';
  private version = this.config.version;

  get<T>(endpoint: string, params?: Record<string, string>): Observable<T> {
    const url = this.buildUrl(endpoint);
    const httpParams = this.buildHttpParams(params);

    return this.http.get<T>(url, { params: httpParams });
  }

  private buildUrl(endpoint: string): string {
    const normalizedEndpoint = endpoint.startsWith('/')
      ? endpoint.substring(1)
      : endpoint;

    if (this.version) {
      return `${this.baseUrl}/${this.version}/${normalizedEndpoint}`;
    }

    return `${this.baseUrl}/${normalizedEndpoint}`;
  }

  private buildHttpParams(params?: Record<string, string>): HttpParams {
    let httpParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        httpParams = httpParams.set(key, value);
      });
    }

    return httpParams;
  }
}
