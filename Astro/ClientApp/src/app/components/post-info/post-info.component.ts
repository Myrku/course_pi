import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Post} from '../../models/Post';
import {PhotoParam} from '../../models/PhotoParam';
import {AuthService} from '../../services/auth.service';
import {PostService} from '../../services/post.service';
import {takeUntil} from 'rxjs/operators';
import {ReplaySubject} from 'rxjs';
import {ActionResultStatus} from '../../models/Statuses/ActionResultStatus';


@Component({
  selector: 'app-post-info',
  templateUrl: './post-info.component.html',
  styleUrls: ['./post-info.component.css']
})
export class PostInfoComponent implements OnInit {

  id: number;
  postInfo: Post;
  paramInfo: PhotoParam;
  countNewLine: number;
  isLike = false;
  countLikes: number;
  private destroyed$: ReplaySubject<void> = new ReplaySubject<void>();


  constructor(private activateRoute: ActivatedRoute, private postService: PostService,
              private authService: AuthService) {
    this.id = activateRoute.snapshot.params['id'];
  }

  ngOnInit() {
    this.GetPost();
    this.GetLikes();
  }

  GetPost() {
    this.postService.getPostById(this.id).subscribe(res => {
      this.postInfo = res.post;
      this.paramInfo = res.photoParam;
      this.countNewLine = this.postInfo.description_post.match(/\n/g).length + 1;
    });
  }

  LikeClick() {
    if (!this.isLike && this.authService.isAuth()) {
      this.postService.addLikeForPost(this.id).pipe(
        takeUntil(this.destroyed$),
      ).subscribe((res) => {
        if (res === ActionResultStatus.Success) {
          this.countLikes += 1;
          this.isLike = true;
        }
      });
    }
  }

  UnLike() {
    if (this.isLike && this.authService.isAuth()) {
      this.postService.deleteLikeForPost(this.id).pipe(
        takeUntil(this.destroyed$),
      ).subscribe((res) => {
        if (res === ActionResultStatus.Success) {
          this.countLikes -= 1;
          this.isLike = false;
        }
      });
    }
  }

  GetLikes() {
   this.postService.getLikesByPostId(this.id).pipe(
     takeUntil(this.destroyed$),
   ).subscribe(res => {
      this.isLike = res.isLike;
      this.countLikes = res.countLike;
    });
  }
  AddReport(postId: number) {
    console.log(postId);
  }
}
