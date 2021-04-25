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

  @ViewChild('selectLanguage', {static: false}) input; 
  public get isLoggedIn(): boolean {
    return this.authService.isAuth();
  }
  public get isAdmin(): boolean {
    return this.authService.isAdmin();
  }
  public get locale(): string {
    return this.authService.getLocale();
  }
  constructor(private navService: NavBarService, private authService: AuthService,
    public translate: TranslateService) {

  }

  ngAfterViewInit() {
    if (this.locale) {
      this.input.nativeElement.value = this.locale;
    }
  }

  languageChange(locale: string): void {
    this.translate.use(locale);
    this.authService.setLocale(locale);
  }

}
