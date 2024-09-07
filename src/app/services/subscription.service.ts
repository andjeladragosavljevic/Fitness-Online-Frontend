import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionService {
  private apiUrl = 'http://localhost:8080/api/subscriptions';

  constructor(private http: HttpClient) {}

  subscribeToCategory(subscriptionRequest: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, subscriptionRequest);
  }
}
