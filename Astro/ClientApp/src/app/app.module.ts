import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { AddPostComponent } from './components/add-post/add-post.component';
import { MyPostsComponent } from './components/my-posts/my-posts.component';
import {SERVER_API_URL} from './app-injection-tokens';
import {environment} from '../environments/environment';
import {JwtModule} from '@auth0/angular-jwt';
import {ACCESS_TOKEN_KEY} from './services/auth.service';
import {AuthGuard} from './guards/auth.guard';

export function tokenGetter() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);

}

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    AddPostComponent,
    MyPostsComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent},
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent},
      { path: 'add-post', component: AddPostComponent, canActivate: [AuthGuard] },
      { path: 'my-posts', component: MyPostsComponent, canActivate: [AuthGuard] }
    ]),

    JwtModule.forRoot({
      config: {
        tokenGetter,
        allowedDomains: environment.tokenWhiteListdDomians
      }
    })
  ],
  providers: [{
    provide: SERVER_API_URL,
    useValue: environment.serverApi
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
