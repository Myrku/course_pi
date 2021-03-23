import {Component, Inject, OnInit} from '@angular/core';
import {NavBarService} from '../../services/nav-bar.service';
import {FormBuilder, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {AuthService} from '../../services/auth.service';
import {takeUntil} from 'rxjs/operators';
import {ReplaySubject} from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm;
  isRegister = false;
  isNotRegister = false;
  private destroyed$: ReplaySubject<void> = new ReplaySubject<void>();


  constructor(public navBarService: NavBarService, private formBuilder: FormBuilder, private authService: AuthService) {
    this.registerForm = formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(6),]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  ngOnInit() {
    this.navBarService.hide();
  }

  showNav() {
    this.navBarService.show();
  }

  get _username() {
    return this.registerForm.get('username');
  }

  get _password() {
    return this.registerForm.get('password');
  }

  get _email() {
    return this.registerForm.get('email');
  }

  register(registerData) {
    const newUser = new FormData();
    newUser.append('username', registerData.username);
    newUser.append('email', registerData.email);
    newUser.append('password', registerData.password);
    this.authService.registerUser(newUser).pipe(
      takeUntil(this.destroyed$)
    ).subscribe(result => {
        if (result.status === 'Success') {
          this.isRegister = true;
          this.isNotRegister = false;
          this.registerForm.reset();
        } else {
          this.isRegister = false;
          this.isNotRegister = true;
        }
      }
    );
  }
}
