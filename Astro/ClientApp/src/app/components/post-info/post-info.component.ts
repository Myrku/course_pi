import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Post} from '../../models/Post';
import {PhotoParam} from '../../models/PhotoParam';
import {AuthService} from '../../services/auth.service';
import {PostService} from '../../services/post.service';
import {takeUntil} from 'rxjs/operators';
import {ReplaySubject} from 'rxjs';
import {ActionResultStatus} from '../../models/Statuses/ActionResultStatus';
import {ReportService} from '../../services/report.service';
import {ToastService} from '../../services/toast.service';
import {CommentService} from '../../services/comment.service';
import {CreateComment} from '../../models/CreateComment';
import {CommentInfo} from '../../models/CommentInfo';
import {EditComment} from '../../models/EditComment';


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
  comments: CommentInfo[] = [];
  isNewComment = true;
  editableComment: CommentInfo;
  private destroyed$: ReplaySubject<void> = new ReplaySubject<void>();
  @ViewChild('inputComment', {static: false}) inputCommentElem;

  constructor(private activateRoute: ActivatedRoute, private postService: PostService,
              private authService: AuthService, private reportService: ReportService,
              private toastService: ToastService, private commentService: CommentService) {
    this.id = parseInt(activateRoute.snapshot.params['id'], 0);
  }

  ngOnInit() {
    this.GetPost();
    this.GetLikes();
    this.getComments();
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
  AddReport() {
    this.reportService.addReport(this.id).pipe(
      takeUntil(this.destroyed$),
    ).subscribe((res) => {
      if (res === ActionResultStatus.Success) {
        this.toastService.show(`Жалоба успешно отправлена`,
          { classname: 'bg-success text-light', delay: 3000 });
      } else {
        this.toastService.show(`Ошибка при отправлении жалобы`,
          { classname: 'bg-danger text-light', delay: 3000 });
      }
    });
  }
  getComments() {
    this.commentService.getComments(this.id).pipe(
      takeUntil(this.destroyed$),
    ).subscribe((res) => {
      this.comments = res;
    });
  }
  addComment() {
    if (this.isNewComment) {
      const createComment = new CreateComment();
      createComment.postId = this.id;
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
  cancelComment() {
    this.inputCommentElem.nativeElement.innerText = '';
    this.inputCommentElem.nativeElement.focused = false;
  }
  deleteComment(commentId: number, event: boolean) {
    if (event) {
      this.comments = this.comments.filter(x => x.commentId !== commentId);
      this.toastService.show(`Комментарий успешно удален`,
        { classname: 'bg-success text-light', delay: 3000 });
    } else {
      this.toastService.show(`Ошибка при удалении комментария`,
        { classname: 'bg-danger text-light', delay: 3000 });
    }
  }
}
