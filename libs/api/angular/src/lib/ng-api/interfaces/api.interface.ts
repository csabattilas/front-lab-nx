import { Observable } from 'rxjs';

export interface ApiService {
  get<T>(endpoint: string, params?: Record<string, string>): Observable<T>;
}
