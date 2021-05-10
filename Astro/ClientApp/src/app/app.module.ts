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
import { SERVER_API_URL } from './app-injection-tokens';
import { environment } from '../environments/environment';
import { JwtModule } from '@auth0/angular-jwt';
import { ACCESS_TOKEN_KEY, AuthService } from './services/auth.service';
import { AuthGuard } from './guards/auth.guard';
import { CardPostComponent } from './components/card-post/card-post.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PostInfoComponent } from './components/post-info/post-info.component';
import { EditPostComponent } from './components/edit-post/edit-post.component';
import { UsersListComponent } from './components/users-list/users-list.component';
import { AdminGuard } from './guards/admin.guard';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastComponent } from './shared/components/toast/toast.component';
import { ReportsComponent } from './components/reports/reports.component';
import { CommentComponent } from './components/comment/comment.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { UserPageComponent } from './components/user-page/user-page.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ReportGuard } from './guards/report.guard';
import { UserPostsComponent } from './components/user-posts/user-posts.component';
import { VerificationComponent } from './components/verification/verification.component';

export function tokenGetter() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
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
    EditPostComponent,
    UsersListComponent,
    ToastComponent,
    ReportsComponent,
    CommentComponent,
    UserPageComponent,
    UserPostsComponent,
    VerificationComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    InfiniteScrollModule,
    NgxSpinnerModule,
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    NgxChartsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'add-post', component: AddPostComponent, canActivate: [AuthGuard] },
      { path: 'my-posts', component: MyPostsComponent, canActivate: [AuthGuard] },
      { path: 'post-info/:id', component: PostInfoComponent },
      { path: 'post-edit/:id', component: EditPostComponent, canActivate: [AuthGuard] },
      { path: 'list-users', component: UsersListComponent, canActivate: [AdminGuard] },
      { path: 'reports', component: ReportsComponent, canActivate: [ReportGuard] },
      { path: 'user-info', component: UserPageComponent, canActivate: [AuthGuard]},
      { path: 'user-posts/:id', component: UserPostsComponent },
      { path: 'verify', component: VerificationComponent }
    ]),

    JwtModule.forRoot({
      config: {
        tokenGetter,
        allowedDomains: environment.tokenWhiteListdDomians
      }
    }),
    NgbModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      defaultLanguage: 'en',
    }),
  ],
  providers: [{
    provide: SERVER_API_URL,
    useValue: environment.serverApi
  }],
  bootstrap: [AppComponent]
})
export class AppModule { 
  constructor(translate: TranslateService, authService: AuthService) {
    const locale = authService.getLocale();
    translate.use(locale? locale : 'en');
  }
}
