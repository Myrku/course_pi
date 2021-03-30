import { Component, OnInit } from '@angular/core';
import {NavBarService} from '../../services/nav-bar.service';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  public get isLoggedIn(): boolean {
    return this.authService.isAuth();
  }
  public get isAdmin(): boolean {
    return this.authService.isAdmin();
  }
  constructor(private navService: NavBarService, private authService: AuthService) {

  }

  ngOnInit() {

  }

}
