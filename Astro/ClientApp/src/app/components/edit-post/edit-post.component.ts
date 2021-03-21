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
import {PostService} from '../../services/post.service';
import {ReplaySubject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

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
  private destroyed$: ReplaySubject<void> = new ReplaySubject<void>();

  @ViewChild('descArea', {static: false}) textarea: ElementRef;


  constructor(private activateRoute: ActivatedRoute, private postService: PostService,
              private router: Router) {
    this.id = activateRoute.snapshot.params['id'];
  }

  ngOnInit() {
    this.GetPost();
  }

  GetPost() {
    this.postService.getPostById(this.id).pipe(
      takeUntil(this.destroyed$),
    ).subscribe(res => {
      this.postInfo = res.post;
      this.photoParam = res.param;
      this.countnewline = this.postInfo.description_post.match(/\n/g).length + 1;
      this.url = this.postInfo.url_photo;
    });
  }

  UploadChanges() {
    this.postService.editPost(this.postInfo, this.photoParam).subscribe(res => {
      if (res.status === 'Success') {
        this.router.navigate(['my-posts']);
      } else {
        this.isError = true;
      }
    });
  }
}
