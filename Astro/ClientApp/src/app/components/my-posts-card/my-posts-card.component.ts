import {Component, Inject, Input, OnInit} from '@angular/core';
import {Post} from '../../models/Post';
import {HttpClient} from '@angular/common/http';
import {SERVER_API_URL} from '../../app-injection-tokens';
import {PostService} from '../../services/post.service';
import {takeUntil} from 'rxjs/operators';
import {ReplaySubject} from 'rxjs';

@Component({
  selector: 'app-my-posts-card',
  templateUrl: './my-posts-card.component.html',
  styleUrls: ['./my-posts-card.component.css']
})
export class MyPostsCardComponent implements OnInit {

  @Input() data;
  post = new Post();
  isDelete = false;
  private destroyed$: ReplaySubject<void> = new ReplaySubject<void>();

  constructor(private postService: PostService) {
  }

  ngOnInit() {
    this.post = this.data;
    console.log(this.post);
    if (this.post.description_post != null && this.post.description_post.length >= 100) {
      this.post.description_post = this.post.description_post.slice(0, 97) + '...';
    }
  }

  DeletePost(id: number) {
    this.postService.deletePostById(id).pipe(
      takeUntil(this.destroyed$),
    ).subscribe(res => {
      if (res.status === 'Success') {
        this.isDelete = true;
      }
    });
  }
}
