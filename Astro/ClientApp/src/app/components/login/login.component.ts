import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {NavBarService} from '../../services/nav-bar.service';
import {HttpClient} from '@angular/common/http';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm;
  isError = false;

  constructor(public navServ: NavBarService, private formBuilder: FormBuilder, private http: HttpClient,
              @Inject('BASE_URL') private baseUrl: string, private authService: AuthService, private router: Router) {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(6)]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  ngOnInit() {
    this.navServ.hide();
  }

  showNav() {
    this.navServ.show();
  }


  login(loginData) {
    this.authService.login(loginData.username.toString(), loginData.password.toString()).subscribe(res => {
      if (res) {
        this.router.navigate(['']);
        this.showNav();
      } else {
        this.isError = true;
      }
    }, error => {
      this.isError = true;
    });
  }

  get _username() {
    return this.loginForm.get('username');
  }

  get _password() {
    return this.loginForm.get('password');
  }
}
