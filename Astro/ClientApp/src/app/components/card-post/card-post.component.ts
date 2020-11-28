import {Component, Inject, Input, OnInit} from '@angular/core';
import {Post} from '../../models/Post';
import {HttpClient} from '@angular/common/http';
import {SERVER_API_URL} from '../../app-injection-tokens';

@Component({
  selector: 'app-card-post',
  templateUrl: './card-post.component.html',
  styleUrls: ['./card-post.component.css']
})
export class CardPostComponent implements OnInit {

  @Input() data;
  post = new Post();
  constructor(private http: HttpClient, @Inject(SERVER_API_URL) private apiUrl) { }

  ngOnInit() {
    this.post = this.data;
    if (this.post.description_post.length >= 100) {
      this.post.description_post = this.post.description_post.slice(0, 97) + '...';
    }
  }

}
