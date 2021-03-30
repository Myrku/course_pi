import {Inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Token} from '@angular/compiler/src/ml_parser/lexer';
import {HttpClient} from '@angular/common/http';
import {SERVER_API_URL} from '../app-injection-tokens';
import {JwtHelperService} from '@auth0/angular-jwt';
import {Router} from '@angular/router';
import {tap} from 'rxjs/operators';
import {ActionResultStatus} from '../models/Statuses/ActionResultStatus';
import {Roles} from '../models/Statuses/Roles';

export const ACCESS_TOKEN_KEY = 'access_token';
export const USERNAME = 'username';
export const ROLEID = 'roleId';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, @Inject(SERVER_API_URL) private apiUrl: string,
              private jwtHelper: JwtHelperService, private router: Router) {
  }

  login(username: string, password: string): Observable<Token> {
    const body = new FormData();
    body.append('username', username);
    body.append('password', password);
    return this.http.post<any>(this.apiUrl + 'api/auth/login', body).pipe(
      tap( authInfo => {
        // @ts-ignore
        localStorage.setItem(ACCESS_TOKEN_KEY, authInfo.accessToken);
        // @ts-ignore
        localStorage.setItem(USERNAME, authInfo.username);
        localStorage.setItem(ROLEID, authInfo.role);
      })
    );
  }

  isAuth(): boolean {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    return token && !this.jwtHelper.isTokenExpired(token);
  }

  logout(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(USERNAME);
    localStorage.removeItem(ROLEID);
    this.router.navigate(['']);
  }
  registerUser(newUser: FormData): Observable<ActionResultStatus> {
    return this.http.post<ActionResultStatus>(this.apiUrl + 'api/auth/register', newUser);
  }
  getUsername(): string {
    return localStorage.getItem(USERNAME);
  }
  isAdmin(): boolean {
    const role = parseInt(localStorage.getItem(ROLEID), null);
    return role === Roles.Admin;
  }
}
