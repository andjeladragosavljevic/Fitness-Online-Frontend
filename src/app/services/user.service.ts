import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/User';
import { Admin } from '../models/Admin';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  userId = Number(localStorage.getItem('userId'));
  token = localStorage.getItem('token');

  readonly baseUrl = 'http://localhost:8080/api';
  constructor(private http: HttpClient) {}

  getAvailableUsers(): Observable<User[]> {
    this.userId = Number(localStorage.getItem('userId')) || 0;

    return this.http.get<User[]>(
      `${this.baseUrl}/users/available?currentUserId=${this.userId}`
    );
  }

  getAdvisors(): Observable<Admin[]> {
    return this.http.get<Admin[]>(`${this.baseUrl}/advisors`);
  }
}
