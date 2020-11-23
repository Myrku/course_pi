import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {SERVER_API_URL} from '../../app-injection-tokens';
import {Post} from '../../models/Post';
import {PhotoParam} from '../../models/PhotoParam';


@Component({
  selector: 'app-post-info',
  templateUrl: './post-info.component.html',
  styleUrls: ['./post-info.component.css']
})
export class PostInfoComponent implements OnInit {

  id: number;
  postInfo: Post;
  paramInfo: PhotoParam;
  constructor(private activateRoute: ActivatedRoute, private http: HttpClient, @Inject(SERVER_API_URL) private apiUrl) {
    this.id = activateRoute.snapshot.params['id'];
  }

  ngOnInit() {
    this.GetPost();
  }

  GetPost() {
    this.http.get(this.apiUrl + 'api/post/getpost/' + this.id).subscribe(res =>{
      console.log(res);
      // @ts-ignore
      this.postInfo = res.post;
      // @ts-ignore
      this.paramInfo = res.param;
      const countnewline = this.postInfo.description_post.match(/\n/g).length;
      // @ts-ignore
      document.getElementById('descArea').rows = countnewline + 1;

    });
  }

}
