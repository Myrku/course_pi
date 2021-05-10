import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ReplaySubject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { ActionResultStatus } from 'src/app/models/Statuses/ActionResultStatus';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.css']
})
export class VerificationComponent implements OnInit {

  private destroyed$ = new ReplaySubject<void>();
  showError = false;
  
  constructor(private activateRoute: ActivatedRoute, public spinner: NgxSpinnerService, public authService: AuthService,
    private router: Router) {
  
  }

  ngOnInit() {
    this.activateRoute.queryParams.pipe(
      takeUntil(this.destroyed$),
    ).subscribe(params => {
      const code = params['code'];
      const userId = params['userId'];
      this.verificationUser(code, userId);
    });
  }

  verificationUser(code: string, userId: number): void {
    this.spinner.show('getUserPosts');
    this.authService.verifyUser(code, userId).pipe(
      takeUntil(this.destroyed$),
    ).subscribe((res) => {
      if(res === ActionResultStatus.Success) {
        this.spinner.hide('getUserPosts');
        this.router.navigate(['/login']);
      } else {
        this.spinner.hide('getUserPosts');
        this.showError = true;
      }
    }, error => {
      this.spinner.hide('getUserPosts');
      this.showError = true;
    });
  }
}
