import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, AuthResponse, AuthUser, Organization } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly tokenKey = 'nibo_token';
  private readonly userKey = 'nibo_user';

  readonly currentUser = signal<AuthUser | null>(this.readStoredUser());

  get token(): string | null {
    return this.isBrowser ? localStorage.getItem(this.tokenKey) : null;
  }

  get isLoggedIn(): boolean {
    return !!this.token;
  }

  // POST /v1/users/auth — returns the authenticated user and a JWT
  login(credentials: { email: string; password: string }): Observable<AuthUser> {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/v1/users/auth`, credentials)
      .pipe(map(res => this.persistSession(res)));
  }

  // POST /v1/users — creates the user (and their organization) and returns a JWT
  signUp(payload: { name: string; email: string; password: string }): Observable<AuthUser> {
    const body = { full_name: payload.name, email: payload.email, password: payload.password };
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/v1/users`, body)
      .pipe(map(res => this.persistSession(res)));
  }

  // TODO(backend): start the Google OAuth flow (redirect to provider / popup)
  loginWithGoogle(): Observable<void> {
    return new Observable(sub => sub.next());
  }

  // POST /v1/users/recover-password — emails a reset link to the user
  requestPasswordReset(email: string): Observable<void> {
    return this.http
      .post<ApiResponse<null>>(`${environment.apiUrl}/v1/users/recover-password`, { email })
      .pipe(map(() => void 0));
  }

  // POST /v1/users/reset-password/{key} — the key arrives in the emailed reset link
  // as ?pid=<key> on the frontend's /auth/reset-password page (page not built yet)
  resetPassword(key: string, password: string): Observable<void> {
    return this.http
      .post<ApiResponse<null>>(`${environment.apiUrl}/v1/users/reset-password/${key}`, { password })
      .pipe(map(() => void 0));
  }

  // POST /v1/users/verify-otp — validates the emailed code and returns a
  // one-time reset key used by resetPassword below
  verifyOtp(email: string, otp: string): Observable<string> {
    return this.http
      .post<ApiResponse<{ reset_key: string }>>(`${environment.apiUrl}/v1/users/verify-otp`, { email, otp })
      .pipe(
        map(res => {
          if (!res.success || !res.data?.reset_key) {
            throw new Error(res.message || 'Verification failed');
          }
          return res.data.reset_key;
        })
      );
  }

  // merges fresh organization data into the stored session user
  updateOrganization(org: Organization): void {
    const user = this.currentUser();
    if (!user) return;
    const updated: AuthUser = {
      ...user,
      organization_id: user.organization_id ?? org._id,
      organization: { ...(user.organization ?? { _id: org._id }), ...org },
    };
    if (this.isBrowser) {
      localStorage.setItem(this.userKey, JSON.stringify(updated));
    }
    this.currentUser.set(updated);
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.userKey);
    }
    this.currentUser.set(null);
  }

  private persistSession(res: AuthResponse): AuthUser {
    if (!res.success || !res.data || !res.token) {
      throw new Error(res.message || 'Authentication failed');
    }
    if (this.isBrowser) {
      localStorage.setItem(this.tokenKey, res.token);
      localStorage.setItem(this.userKey, JSON.stringify(res.data));
    }
    this.currentUser.set(res.data);
    return res.data;
  }

  private readStoredUser(): AuthUser | null {
    if (!this.isBrowser) {
      return null;
    }
    try {
      return JSON.parse(localStorage.getItem(this.userKey) ?? 'null');
    } catch {
      return null;
    }
  }
}
