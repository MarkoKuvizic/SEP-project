import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  username?: string;
  roles?: string[];
  authenticated?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:8444'; 
  private readonly AUTH_KEY = 'car_rental_auth';
  private readonly USER_KEY = 'car_rental_user';

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService
  ) {}

  login(credentials: LoginCredentials): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    const body = new URLSearchParams();
    body.set('username', credentials.username);
    body.set('password', credentials.password);

    return this.http.post(`${this.apiUrl}/auth/login`, body.toString(), {
      headers,
      withCredentials: true // Important for session cookies
    }).pipe(
      tap((response: any) => {
        this.setAuthData(credentials.username);
        this.toastr.success(`Welcome, ${credentials.username}!`);
      }),
      catchError(error => {
        this.clearAuthData();
        return throwError(() => error);
      })
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/logout`, {}, {
      withCredentials: true
    }).pipe(
      tap(() => {
        this.clearAuthData();
        this.toastr.info('You have been logged out');
        this.router.navigate(['/login']);
      }),
      catchError(error => {
        this.clearAuthData();
        this.router.navigate(['/login']);
        return of(null);
      })
    );
  }

  getCurrentUser(): string | null {
    const userData = localStorage.getItem(this.USER_KEY);
    return userData ? JSON.parse(userData).username : null;
  }

  getUserRoles(): string[] {
    const userData = localStorage.getItem(this.USER_KEY);
    return userData ? JSON.parse(userData).roles || [] : [];
  }

  isLoggedIn(): boolean {
    return localStorage.getItem(this.AUTH_KEY) === 'true';
  }

  isAdmin(): boolean {
    return this.getUserRoles().includes('ADMIN');
  }

  setAuthData(username: string, roles: string[] = []): void {
    localStorage.setItem(this.AUTH_KEY, 'true');
    localStorage.setItem(this.USER_KEY, JSON.stringify({
      username,
      roles,
      loginTime: new Date().toISOString()
    }));
  }

  clearAuthData(): void {
    localStorage.removeItem(this.AUTH_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  checkSession(): Observable<boolean> {
    return this.http.get<AuthResponse>(`${this.apiUrl}/api/user/me`, {
      withCredentials: true
    }).pipe(
      map(response => {
        if (response.authenticated && response.username) {
          this.setAuthData(response.username, response.roles || []);
          return true;
        }
        this.clearAuthData();
        return false;
      }),
      catchError(() => {
        this.clearAuthData();
        return of(false);
      })
    );
  }

  // HTTP Interceptor helper - gets CSRF token if needed
  getCsrfToken(): string | null {
    return localStorage.getItem('XSRF-TOKEN');
  }
}