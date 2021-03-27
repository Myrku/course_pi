import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PhotoParam} from '../../models/PhotoParam';
import {Post} from '../../models/Post';
import {PostService} from '../../services/post.service';
import {ReplaySubject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {ActionResultStatus} from '../../models/Statuses/ActionResultStatus';
import {PostTypes} from '../../models/Statuses/PostTypes';

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
  postType = PostTypes;
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
    ).subscribe((res) => {
      console.log(res);
      this.postInfo = res.post;
      this.photoParam = res.photoParam;
      this.countnewline = this.postInfo.description_post.match(/\n/g).length + 1;
      this.url = this.postInfo.url_photo;
    });
  }

  UploadChanges() {
    console.log(this.postInfo);
    this.postService.editPost(this.postInfo, this.photoParam).subscribe((res) => {
      if (res === ActionResultStatus.Success) {
        this.router.navigate(['my-posts']);
      } else {
        this.isError = true;
      }
    });
  }
}
