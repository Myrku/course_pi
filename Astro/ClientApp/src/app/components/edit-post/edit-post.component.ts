import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {SERVER_API_URL} from '../../app-injection-tokens';
import {PhotoParam} from '../../models/PhotoParam';
import {AddPostInfo} from '../../models/AddPostInfo';
import exifr from 'exifr';
import {Post} from '../../models/Post';
import {AuthService} from '../../services/auth.service';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.css']
})
export class EditPostComponent implements OnInit {

  id;
  url;
  photoParam = new PhotoParam();
  isError = false;
  countnewline: number;
  postInfo = new Post();

  @ViewChild('descArea', {static: false}) textarea: ElementRef;


  constructor(private activateRoute: ActivatedRoute, private http: HttpClient, @Inject(SERVER_API_URL) private apiUrl,
              private router: Router) {
    this.id = activateRoute.snapshot.params['id'];
  }

  ngOnInit() {
    this.GetPost();
  }

  GetPost() {
    this.http.get(this.apiUrl + 'api/post/getpost/' + this.id).subscribe(res => {
      console.log(res);
      // @ts-ignore
      this.postInfo = res.post;
      // @ts-ignore
      this.photoParam = res.param;
      this.countnewline = this.postInfo.description_post.match(/\n/g).length + 1;
      this.url = this.postInfo.url_photo;
    });
  }

  UploadChanges() {
    this.http.put(this.apiUrl + 'api/post/editpost', {post: this.postInfo, photoParam: this.photoParam}).subscribe(res => {
      // @ts-ignore
      if (res.status === 'Success') {
        this.router.navigate(['my-posts']);
      } else {
        this.isError = true;
      }
    });
  }
}
