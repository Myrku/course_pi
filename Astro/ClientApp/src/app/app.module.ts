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
import { CardPostComponent } from './components/card-post/card-post.component';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';
import {NgxSpinnerModule} from 'ngx-spinner';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { PostInfoComponent } from './components/post-info/post-info.component';
import { MyPostsCardComponent } from './components/my-posts-card/my-posts-card.component';
import { EditPostComponent } from './components/edit-post/edit-post.component';


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
    CardPostComponent,
    PostInfoComponent,
    MyPostsCardComponent,
    EditPostComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    InfiniteScrollModule,
    NgxSpinnerModule,
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent},
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent},
      { path: 'add-post', component: AddPostComponent, canActivate: [AuthGuard] },
      { path: 'my-posts', component: MyPostsComponent, canActivate: [AuthGuard] },
      { path: 'post-info/:id', component: PostInfoComponent },
      { path: 'post-edit/:id', component: EditPostComponent }
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
