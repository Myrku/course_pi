import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ReplaySubject} from 'rxjs';
import {CommentInfo} from '../../models/CommentInfo';
import {CommentService} from '../../services/comment.service';
import {takeUntil} from 'rxjs/operators';
import {ActionResultStatus} from '../../models/Statuses/ActionResultStatus';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {

  constructor(private commentService: CommentService) { }
  private destroyed$ = new ReplaySubject<void>();

  @Input() commentInfo: CommentInfo;
  @Output() onDeleted = new EventEmitter<boolean>();
  @Output() onEdit = new EventEmitter<boolean>();

  ngOnInit() {
  }
  deleteComment() {
    this.commentService.deleteComment(this.commentInfo.commentId).pipe(
      takeUntil(this.destroyed$),
    ).subscribe((res) => {
      if (res === ActionResultStatus.Success) {
        this.onDeleted.emit(true);
      } else {
        this.onDeleted.emit(false);
      }
    });
  }
  editComment() {
    this.onEdit.emit(true);
  }
}
