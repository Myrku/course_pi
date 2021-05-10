import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { error } from 'selenium-webdriver';
import { Post } from 'src/app/models/Post';
import { CardTypes } from 'src/app/models/Statuses/CardTypes';
import { AuthService } from 'src/app/services/auth.service';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-user-posts',
  templateUrl: './user-posts.component.html',
  styleUrls: ['./user-posts.component.css']
})
export class UserPostsComponent implements OnInit {

  private readonly userId: number;
  userPosts: Post[];
  cardType = CardTypes.Info;

  private destroyed$ = new ReplaySubject<void>();

  constructor(private activateRoute: ActivatedRoute, private postService: PostService,
    public spinner: NgxSpinnerService, public authService: AuthService) {
    this.userId = parseInt(this.activateRoute.snapshot.params['id'], 0);
  }

  ngOnInit() {
    this.getPosts();
  }


  getPosts(): void {
    this.spinner.show('getUserPosts');
    this.postService.getPostByUserId(this.userId).pipe(
      takeUntil(this.destroyed$),
    ).subscribe((res) => {
      this.userPosts = res;
      this.spinner.hide('getUserPosts');
    }, error => this.spinner.hide('getUserPosts'));
  }
}
