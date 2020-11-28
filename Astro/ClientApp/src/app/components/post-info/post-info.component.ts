import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {SERVER_API_URL} from '../../app-injection-tokens';
import {Post} from '../../models/Post';
import {PhotoParam} from '../../models/PhotoParam';
import {AuthService} from '../../services/auth.service';


@Component({
  selector: 'app-post-info',
  templateUrl: './post-info.component.html',
  styleUrls: ['./post-info.component.css']
})
export class PostInfoComponent implements OnInit {

  id: number;
  postInfo: Post;
  paramInfo: PhotoParam;
  countnewline: number;
  isLike = false;
  countLikes;
  @ViewChild('descArea', {static: false}) textarea: ElementRef;

  constructor(private activateRoute: ActivatedRoute, private http: HttpClient, @Inject(SERVER_API_URL) private apiUrl,
              private authService: AuthService) {
    this.id = activateRoute.snapshot.params['id'];
  }

  ngOnInit() {
    this.GetPost();
    this.GetLikes();
  }

  GetPost() {
    this.http.get(this.apiUrl + 'api/post/getpost/' + this.id).subscribe(res => {
      console.log(res);
      // @ts-ignore
      this.postInfo = res.post;
      // @ts-ignore
      this.paramInfo = res.param;
      this.countnewline = this.postInfo.description_post.match(/\n/g).length + 1;

    });
  }

  LikeClick() {
    if (!this.isLike && this.authService.isAuth()) {
      this.http.get(this.apiUrl + 'api/post/setlike/' + this.id).subscribe(res => {
        // @ts-ignore
        if (res.status === 'Success') {
          this.countLikes += 1;
          this.isLike = true;
        }
      });
    } else {
    }
  }

  UnLike() {
    if (this.isLike && this.authService.isAuth()) {
      this.http.get(this.apiUrl + 'api/post/unlike/' + this.id).subscribe(res => {
        // @ts-ignore
        if (res.status === 'Success') {
          this.countLikes -= 1;
          this.isLike = false;
        }
      });
    }
  }

  GetLikes() {
    this.http.get(this.apiUrl + 'api/post/getlikes/' + this.id).subscribe(res => {
      // @ts-ignore
      this.isLike = res.isLike;
      // @ts-ignore
      this.countLikes = res.countLikes;
    });
  }
}
