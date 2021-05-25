import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ReportGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {
  }
  canActivate(): boolean {
    const adminOrModer = this.authService.isAdmin() || this.authService.isModerator();
    if (!adminOrModer) {
      this.router.navigate(['']);
    }
    return true;
  }
}
