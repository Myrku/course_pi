import {Component, Inject, OnInit} from '@angular/core';
import {Post} from '../../models/Post';
import {HttpClient} from '@angular/common/http';
import {SERVER_API_URL} from '../../app-injection-tokens';

@Component({
  selector: 'app-my-posts',
  templateUrl: './my-posts.component.html',
  styleUrls: ['./my-posts.component.css']
})
export class MyPostsComponent implements OnInit {

  myposts: Post[];
  constructor(private http: HttpClient, @Inject(SERVER_API_URL) private apiUrl) { }

  ngOnInit() {
    this.GetMyPosts();
  }
  GetMyPosts() {
    this.http.get(this.apiUrl + 'api/post/getpostsuser').subscribe((res: Post[]) => {
      this.myposts = res;

    });
  }

}
