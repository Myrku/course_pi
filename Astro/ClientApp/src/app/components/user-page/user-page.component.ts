import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ReplaySubject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { Post } from 'src/app/models/Post';
import { ActionResultStatus } from 'src/app/models/Statuses/ActionResultStatus';
import { CardTypes } from 'src/app/models/Statuses/CardTypes';
import { CameraInfo, ChartInfo, UserPageContext } from 'src/app/models/UserPageContext';
import { AuthService } from 'src/app/services/auth.service';
import { PostService } from 'src/app/services/post.service';
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
  cameraInfo = new CameraInfo();
  chartInfo:ChartInfo[] = [];

  private destroyed$ = new ReplaySubject<void>();
  
  password: string;
  newPassword: string;

  userLikesPosts: Post[];
  cardType = CardTypes.Info;

  constructor(private authService: AuthService, private userService: UserService,
    private toastService: ToastService, private translateService: TranslateService, private postService: PostService) { 
      this.context.cameraInfo.camera = '';
      this.context.cameraInfo.cameraLens = '';
  }
  
  ngOnInit(): void {
    this.userService.getContext().pipe(
      takeUntil(this.destroyed$),
    ).subscribe((res) => {
      this.context = res;
      let hideChart = true;
      if (res.cameraInfo.camera) {
        this.cameraInfo.camera = res.cameraInfo.camera;
      }

      if (res.cameraInfo.camera) {
        this.cameraInfo.cameraLens = res.cameraInfo.cameraLens;
      }
      for (let index = 0; index < res.chartInfo.length; index++) {
        if(res.chartInfo[index].value > 0) {
          hideChart = false;
        }
      }

      if(!hideChart) {
        this.chartInfo = this.context.chartInfo;
      }
      if(hideChart) {
        this.context = null;
      }
    });
    this.getUserLikesPosts();
  }

  get getUsername(): string {
    return this.authService.getUsername();
  }

  saveCamera(): void {
    this.userService.setCamera(this.cameraInfo).pipe(
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

  getUserLikesPosts(): void {
    this.postService.getLikePostsCurUser().pipe(
      takeUntil(this.destroyed$),
    ).subscribe((res) => {
      if(res) {
        this.userLikesPosts = res;
      }
    })
  }
}
