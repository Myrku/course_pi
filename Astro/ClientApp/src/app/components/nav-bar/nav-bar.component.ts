import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {NavBarService} from '../../services/nav-bar.service';
import {AuthService} from '../../services/auth.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {

  public get isLoggedIn(): boolean {
    return this.authService.isAuth();
  }

  public get isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  public get isModer(): boolean {
    return this.authService.isModerator();
  }

  public get locale(): string {
    return this.authService.getLocale();
  }
  
  constructor(public navService: NavBarService, public authService: AuthService,
    public translate: TranslateService) {

  }

  languageChange(locale: string): void {
    this.translate.use(locale);
    this.authService.setLocale(locale);
  }
}
