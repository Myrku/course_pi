import {Component, Inject, Input, OnInit} from '@angular/core';
import {Post} from '../../models/Post';
import {CardTypes} from '../../models/Statuses/CardTypes';
import {takeUntil} from 'rxjs/operators';
import {ActionResultStatus} from '../../models/Statuses/ActionResultStatus';
import {PostService} from '../../services/post.service';
import {ReplaySubject} from 'rxjs';

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
  isDelete = false;
  private destroyed$: ReplaySubject<void> = new ReplaySubject<void>();

  constructor(private postService: PostService) {
  }
  ngOnInit() {
    this.post = this.data;
    if (this.post.description_post.length >= 100) {
      this.post.description_post = this.post.description_post.slice(0, 97) + '...';
    }
  }
  DeletePost(id: number) {
    this.postService.deletePostById(id).pipe(
      takeUntil(this.destroyed$),
    ).subscribe((res) => {
      if (res === ActionResultStatus.Success) {
        this.isDelete = true;
      }
    });
  }
}
