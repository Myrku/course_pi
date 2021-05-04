import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ReplaySubject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { ActionResultStatus } from 'src/app/models/Statuses/ActionResultStatus';
import { UserPageContext } from 'src/app/models/UserPageContext';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css']
})
export class UserPageComponent implements OnInit {

  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = false;
  showXAxisLabel = true;
  showYAxisLabel = true;


  context = new UserPageContext();
  private destroyed$ = new ReplaySubject<void>();
  
  password: string;
  newPassword: string;

  constructor(private authService: AuthService, private userService: UserService,
    private toastService: ToastService, private translateService: TranslateService) { 
  }
  
  ngOnInit(): void {
    this.userService.getContext().pipe(
      takeUntil(this.destroyed$),
    ).subscribe((res) => {
      this.context = res;
    });
  }

  get getUsername(): string {
    return this.authService.getUsername();
  }

  saveCamera(): void {
    this.userService.setCamera(this.context.cameraInfo).pipe(
      takeUntil(this.destroyed$),
    ).subscribe((res) => {
      if (res === ActionResultStatus.Success) {
        const toastText = this.translateService.get('UserPage.Toast.SuccessAddCamera');
        toastText.pipe(takeUntil(this.destroyed$)).subscribe((tr) => {
          this.toastService.show(tr, { classname: 'bg-success text-light', delay: 3000 });
        });
      } else {
        const toastText = this.translateService.get('UserPage.Toast.SuccessAddCamera');
        toastText.pipe(takeUntil(this.destroyed$)).subscribe((tr) => {
          this.toastService.show(tr, { classname: 'bg-danger text-light', delay: 3000 });
        });
      }
    });
  }

  resetPassword(): void {
    this.authService.resetPassword(this.password, this.newPassword).pipe(
      takeUntil(this.destroyed$),
    ).subscribe((res) => {
      if (res === ActionResultStatus.Success) {
        const toastText = this.translateService.get('UserPage.Toast.PasswordChanged');
        toastText.pipe(takeUntil(this.destroyed$)).subscribe((tr) => {
          this.toastService.show(tr, { classname: 'bg-success text-light', delay: 3000 });
        });
      } else {
        const toastText = this.translateService.get('UserPage.Toast.PasswordChangeError');
        toastText.pipe(takeUntil(this.destroyed$)).subscribe((tr) => {
          this.toastService.show(tr, { classname: 'bg-danger text-light', delay: 3000 });
        });
      }
    })
  }
}
