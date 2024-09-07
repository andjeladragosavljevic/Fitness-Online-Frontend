import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  readonly baseUrl = 'http://localhost:8080/api/users';
  constructor(private http: HttpClient) {}

  getAvailableUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/available?currentUserId=41`);
  }
}
