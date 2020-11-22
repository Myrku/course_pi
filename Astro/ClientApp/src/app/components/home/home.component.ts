import {Component, Inject, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SERVER_API_URL} from '../../app-injection-tokens';
import {Post} from '../../models/Post';
import { NgxSpinnerService } from 'ngx-spinner';

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
  constructor(private http: HttpClient, @Inject(SERVER_API_URL) private apiUrl, public spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.loadInitPost();
  }
  loadInitPost() {
    this.http.get(this.apiUrl + 'api/post/getposts').subscribe((res: Post[]) => {
      this.allPosts = res;
      this.lastId = this.allPosts[this.allPosts.length - 1].id;
    });
  }

  onScroll() {
    if(this.notScrolly && this.notEmptyPost) {
      this.spinner.show();
      this.notScrolly = false;
      this.loadNextPost();
    }
  }
  loadNextPost() {
    console.log(this.lastId);
    this.http.get(this.apiUrl + 'api/post/getnextpost/' + this.lastId).subscribe((res: Post[]) => {
      this.spinner.hide();
      if (res.length > 0) {
        this.notEmptyPost = false;
      }
      this.allPosts = this.allPosts.concat(res);
      this.notScrolly = true;
    });
  }
}
