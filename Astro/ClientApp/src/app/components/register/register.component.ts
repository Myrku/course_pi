import {Component, Inject, OnInit} from '@angular/core';
import {NavBarService} from '../../services/nav-bar.service';
import {FormBuilder, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm;
  isRegister = false;
  isNotRegister = false;

  constructor(public navServ: NavBarService, private formBuilder: FormBuilder, private http: HttpClient,
              @Inject('BASE_URL') private baseUrl: string) {
    this.registerForm = formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(6),]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  ngOnInit() {
    this.navServ.hide();
  }

  showNav() {
    this.navServ.show();
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
    const body = new FormData();
    body.append('username', registerData.username);
    body.append('email', registerData.email);
    body.append('password', registerData.password);
    console.log(body);
    this.http.post(this.baseUrl + 'api/auth/register', body).subscribe(result => {
        // @ts-ignore
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
