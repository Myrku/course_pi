import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import { Observable } from 'rxjs';
import {AuthService} from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuardGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {
  }
  canActivate(): boolean {
    if (!this.authService.isAdmin()) {
      this.router.navigate(['']);
    }
    return true;
  }
}
