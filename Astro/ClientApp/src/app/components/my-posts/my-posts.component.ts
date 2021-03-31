import {Component, Inject, OnInit} from '@angular/core';
import {Post} from '../../models/Post';
import {PostService} from '../../services/post.service';
import {ReplaySubject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {CardTypes} from '../../models/Statuses/CardTypes';

@Component({
  selector: 'app-my-posts',
  templateUrl: './my-posts.component.html',
  styleUrls: ['./my-posts.component.css']
})
export class MyPostsComponent implements OnInit {

  myPosts: Post[];
  private destroyed$: ReplaySubject<void> = new ReplaySubject<void>();
  cardType = CardTypes.Edit;

  constructor(private postService: PostService) { }

  ngOnInit() {
    this.GetMyPosts();
  }
  GetMyPosts() {
    this.postService.getMyPosts().pipe(
      takeUntil(this.destroyed$),
    ).subscribe((res) => {
      this.myPosts = res;
    });
  }
}
