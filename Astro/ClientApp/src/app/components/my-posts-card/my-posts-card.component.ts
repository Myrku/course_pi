import {Component, Inject, Input, OnInit} from '@angular/core';
import {Post} from '../../models/Post';
import {HttpClient} from '@angular/common/http';
import {SERVER_API_URL} from '../../app-injection-tokens';

@Component({
  selector: 'app-my-posts-card',
  templateUrl: './my-posts-card.component.html',
  styleUrls: ['./my-posts-card.component.css']
})
export class MyPostsCardComponent implements OnInit {

  @Input() data;
  post = new Post();
  constructor(private http: HttpClient, @Inject(SERVER_API_URL) private apiUrl) {
  }

  ngOnInit() {
    this.post = this.data;
    if (this.post.description_post.length >= 100) {
      this.post.description_post = this.post.description_post.slice(0, 97) + '...';
    }
  }

  DeletePost(id: number) {
    this.http.delete(this.apiUrl + 'api/post/deletepost/' + id).subscribe(res => {
      console.log(res);
      // @ts-ignore
      if (res.status === 'Success') {
        alert('Успешно');
      }
    });
  }
}
