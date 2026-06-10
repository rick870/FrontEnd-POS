import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { TokenRequestDto, AuthResponse } from '../Interfaces/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private myApiUrl: string = environment.endPoint + 'User';

  constructor(private http: HttpClient) {}

  // POST /api/User/Generate/Token
  login(request: TokenRequestDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.myApiUrl + '/Generate/Token', request);
  }

  // POST /api/User/Register
  register(data: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.myApiUrl + '/Register', data);
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem('token');
  }
}