import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private router: Router) {
    this.checkLoginStatus();
  }

  isTokenExpired(token: string): boolean {
    try {
      const decodedToken: any = jwtDecode(token);

      if (decodedToken && decodedToken.exp) {
        const currentTime = Date.now() / 1000;
        return decodedToken.exp < currentTime;
      }

      return true;
    } catch (error) {
      return true;
    }
  }

  isLoggedIn = false;
  loginStatusChanged = new EventEmitter<boolean>();

  checkLoginStatus() {
    if (typeof window !== 'undefined' && localStorage.getItem('token')) {
      const token = localStorage.getItem('token');
      this.isLoggedIn = !!token;
      this.loginStatusChanged.emit(this.isLoggedIn);
    }
  }

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('username');
    }
    this.isLoggedIn = false;
    this.loginStatusChanged.emit(this.isLoggedIn);
  }
}
