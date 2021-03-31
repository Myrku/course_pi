import {Component, OnInit} from '@angular/core';
import {Post} from '../../models/Post';
import { NgxSpinnerService } from 'ngx-spinner';
import {PostService} from '../../services/post.service';
import {ReplaySubject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import { PostTypes } from '../../models/Statuses/PostTypes';
import {CardTypes} from '../../models/Statuses/CardTypes';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  allPosts: Post[];
  notEmptyPost = true;
  notScrolly = true;
  lastId;
  selectedPostType: PostTypes = PostTypes.NoType;
  postType = PostTypes;
  private destroyed$: ReplaySubject<void> = new ReplaySubject<void>();
  cardType = CardTypes.Info;

  constructor(public spinner: NgxSpinnerService, private postService: PostService) {
    this.spinner.show('loadingPage');
  }

  ngOnInit() {
    this.loadInitPost();
  }
  loadInitPost() {
   this.postService.getPostsByType(this.selectedPostType).pipe(
     takeUntil(this.destroyed$),
   ).subscribe((res) => {
      if (res.length > 0) {
        this.allPosts = res;
        this.lastId = this.allPosts[this.allPosts.length - 1].id;
      }
      this.spinner.hide('loadingPage');
    }, error => {
     this.spinner.hide('loadingPage');
   });
  }

  onScroll() {
    if (this.notScrolly && this.notEmptyPost) {
      this.spinner.show();
      this.notScrolly = false;
      this.loadNextPost(this.selectedPostType);
    }
  }
  loadNextPost(type: PostTypes) {
    this.postService.getNextPosts(this.lastId).pipe(
      takeUntil(this.destroyed$),
    ).subscribe((res) => {
      this.spinner.hide();
      if (res.length > 0) {
        this.notEmptyPost = false;
      }
      this.allPosts.push(...res);
      this.notScrolly = true;
    });
  }
  gePostByType(type: PostTypes) {
    this.spinner.show('loadingPage');
    this.selectedPostType = type;
    this.postService.getPostsByType(type).pipe(
      takeUntil(this.destroyed$),
    ).subscribe((res) => {
      this.allPosts = res;
      if (res.length > 0) {
        this.lastId = this.allPosts[this.allPosts.length - 1].id;
      }
      this.spinner.hide('loadingPage');
    }, error => {
      this.spinner.hide('loadingPage');
    });
  }
}
