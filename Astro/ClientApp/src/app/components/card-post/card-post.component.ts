import {Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {Post} from '../../models/Post';
import {CardTypes} from '../../models/Statuses/CardTypes';
import {takeUntil} from 'rxjs/operators';
import {ActionResultStatus} from '../../models/Statuses/ActionResultStatus';
import {PostService} from '../../services/post.service';
import {ReplaySubject} from 'rxjs';
import {ReportService} from '../../services/report.service';

@Component({
  selector: 'app-card-post',
  templateUrl: './card-post.component.html',
  styleUrls: ['./card-post.component.css']
})
export class CardPostComponent implements OnInit {

  @Input() data;
  post = new Post();
  @Input() cardType;
  types = CardTypes;
  private destroyed$: ReplaySubject<void> = new ReplaySubject<void>();
  @Output() onDeleted = new EventEmitter<boolean>();

  constructor(private postService: PostService, private reportService: ReportService) {
  }
  ngOnInit() {
    this.post = this.data;
    if (this.post.description_post && this.post.description_post.length >= 100) {
      this.post.description_post = this.post.description_post.slice(0, 97) + '...';
    }
  }
  DeletePost(id: number) {
    this.postService.deletePostById(id).pipe(
      takeUntil(this.destroyed$),
    ).subscribe((res) => {
      if (res === ActionResultStatus.Success) {
        this.onDeleted.emit(true);
      }
    });
  }
  DeleteReports(id: number) {
    this.reportService.deleteReport(id).pipe(
      takeUntil(this.destroyed$),
    ).subscribe((res) => {
      this.onDeleted.emit(true);
    });
  }
}
