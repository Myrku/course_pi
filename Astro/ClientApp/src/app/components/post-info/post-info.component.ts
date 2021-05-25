import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Post} from '../../models/Post';
import {PhotoParam} from '../../models/PhotoParam';
import {AuthService} from '../../services/auth.service';
import {PostService} from '../../services/post.service';
import {takeUntil} from 'rxjs/operators';
import {from, ReplaySubject} from 'rxjs';
import {ActionResultStatus} from '../../models/Statuses/ActionResultStatus';
import {ReportService} from '../../services/report.service';
import {ToastService} from '../../services/toast.service';
import {CommentService} from '../../services/comment.service';
import {CreateComment} from '../../models/CreateComment';
import {CommentInfo} from '../../models/CommentInfo';
import {EditComment} from '../../models/EditComment';

import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';
import { RatingService } from 'src/app/services/rating.service';
import { PostRatingContext } from 'src/app/models/PostRatingContext';
import { ReportTypes } from 'src/app/models/Statuses/ReportTypes';

@Component({
  selector: 'app-post-info',
  templateUrl: './post-info.component.html',
  styleUrls: ['./post-info.component.css']
})
export class PostInfoComponent implements OnInit {

  postId: number;
  postInfo: Post;
  paramInfo: PhotoParam;
  isLike = false;
  isReported = false;
  countLikes: number;
  comments: CommentInfo[] = [];
  isNewComment = true;
  editableComment: CommentInfo;
  userName: string;
  ratingContext = new PostRatingContext();
  reportType = ReportTypes;

  private destroyed$: ReplaySubject<void> = new ReplaySubject<void>();
  @ViewChild('inputComment', {static: false}) inputCommentElem;

  @ViewChild('mapElem', { static: false }) mapElem: ElementRef;
  map: mapboxgl.Map;
  marker: mapboxgl.Marker;
  lat = 53.902287;
  lng = 27.561824;

  constructor(private activateRoute: ActivatedRoute, private postService: PostService,
              private authService: AuthService, private reportService: ReportService,
              private toastService: ToastService, private commentService: CommentService, private ratingServise: RatingService) {
    this.postId = parseInt(activateRoute.snapshot.params['id'], 0);
    this.ratingContext.curUserRating = 0;
  }

  ngOnInit() {
    this.GetPost();
    this.GetLikes();
    this.getComments();
    this.isReportedPost();
    this.getPostRating();
  }

  ngAfterViewInit() {
    mapboxgl.accessToken = environment.mapToken;
    this.map = new mapboxgl.Map({
      container: this.mapElem.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      zoom: 12,
      center: [this.lng, this.lat]
    });
    this.map.addControl(new mapboxgl.NavigationControl());
  }

  GetPost(): void {
    this.postService.getPostById(this.postId).subscribe(res => {
      this.postInfo = res.post;
      this.paramInfo = res.photoParam;
      this.userName = res.userName;
      if(this.paramInfo.lat_Location && this.paramInfo.lng_Location) {
        new mapboxgl.Marker().setLngLat([this.paramInfo.lng_Location, this.paramInfo.lat_Location]).addTo(this.map);
        this.map.setCenter([this.paramInfo.lng_Location, this.paramInfo.lat_Location]);
      } else {
        this.mapElem.nativeElement.style.display = 'none';
      }
    });
  }

  LikeClick(): void {
    if (!this.isLike && this.authService.isAuth()) {
      this.postService.addLikeForPost(this.postId).pipe(
        takeUntil(this.destroyed$),
      ).subscribe((res) => {
        if (res === ActionResultStatus.Success) {
          this.countLikes += 1;
          this.isLike = true;
        }
      });
    }
  }

  UnLike(): void {
    if (this.isLike && this.authService.isAuth()) {
      this.postService.deleteLikeForPost(this.postId).pipe(
        takeUntil(this.destroyed$),
      ).subscribe((res) => {
        if (res === ActionResultStatus.Success) {
          this.countLikes -= 1;
          this.isLike = false;
        }
      });
    }
  }

  GetLikes(): void {
    this.postService.getLikesByPostId(this.postId).pipe(
      takeUntil(this.destroyed$),
    ).subscribe((res) => {
      if (res) {
        this.isLike = res.isLike;
        this.countLikes = res.countLike;
      }
    });
  }

  AddReport(type: ReportTypes): void {
    this.reportService.addReport(this.postId, type).pipe(
      takeUntil(this.destroyed$),
    ).subscribe((res) => {
      if (res === ActionResultStatus.Success) {
        this.toastService.show(`Жалоба успешно отправлена`,
          { classname: 'bg-success text-light', delay: 3000 });
          this.isReported = true;
      } else {
        this.toastService.show(`Ошибка при отправлении жалобы`,
          { classname: 'bg-danger text-light', delay: 3000 });
      }
    });
  }

  isReportedPost(): void {
    if (this.authService.isAuth()) {
      this.reportService.isReport(this.postId).pipe(
        takeUntil(this.destroyed$)
      ).subscribe((res: boolean) => {
        this.isReported = res;
      });
    }
  }

  getComments(): void {
    this.commentService.getComments(this.postId).pipe(
      takeUntil(this.destroyed$),
    ).subscribe((res) => {
      this.comments = res;
    });
  }

  addComment(): void {
    if (this.isNewComment) {
      const createComment = new CreateComment();
      createComment.postId = this.postId;
      createComment.textComment = this.inputCommentElem.nativeElement.innerText;
      this.commentService.addComment(createComment).pipe(
        takeUntil(this.destroyed$),
      ).subscribe((res) => {
        if (res) {
          this.comments.unshift(res);
          this.toastService.show(`Комментарий успешно отправлен`,
            {classname: 'bg-success text-light', delay: 3000});
        } else {
          this.toastService.show(`Ошибка при комментировании`,
            {classname: 'bg-danger text-light', delay: 3000});
        }
        this.cancelComment();
      });
    } else {
      const editComment = new EditComment();
      editComment.commentId = this.editableComment.commentId;
      editComment.commentText = this.inputCommentElem.nativeElement.innerText;
      this.commentService.editComment(editComment).pipe(
        takeUntil(this.destroyed$),
      ).subscribe((res) => {
        if (res === ActionResultStatus.Success) {
          this.editableComment.textComment = editComment.commentText;
          this.toastService.show(`Комментарий успешно изменен`,
            { classname: 'bg-success text-light', delay: 3000 });
        } else {
          this.toastService.show(`Ошибка при изменении комментария`,
            { classname: 'bg-success text-light', delay: 3000 });
        }
        this.cancelComment();
      });
    }
  }

  editComment(comment: CommentInfo, event) {
    if (event) {
      this.editableComment = comment;
      this.isNewComment = !event;
      this.inputCommentElem.nativeElement.innerText = comment.textComment;
    }
  }

  cancelComment(): void {
    this.inputCommentElem.nativeElement.innerText = '';
    this.inputCommentElem.nativeElement.focused = false;
  }

  deleteComment(commentId: number, event: boolean): void {
    if (event) {
      this.comments = this.comments.filter(x => x.commentId !== commentId);
      this.toastService.show(`Комментарий успешно удален`,
        { classname: 'bg-success text-light', delay: 3000 });
    } else {
      this.toastService.show(`Ошибка при удалении комментария`,
        { classname: 'bg-danger text-light', delay: 3000 });
    }
  }

  getPostRating(): void {
    this.ratingServise.getPostRating(this.postId).pipe(
      takeUntil(this.destroyed$),
    ).subscribe((res) => {
      if (res) {
        this.ratingContext = res;
        if (!this.ratingContext.curUserRating) {
          this.ratingContext.curUserRating = 0;
        }
      }
    });
  }

  setPostRating(): void {
    if (this.ratingContext.curUserRating && this.authService.isAuth()) {
      this.ratingServise.setPostRating(this.postId, this.ratingContext.curUserRating).pipe(
        takeUntil(this.destroyed$),
      ).subscribe((res) => {
        this.ratingContext = res;
      });
    }
  }
}
