import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PhotoParam} from '../../models/PhotoParam';
import {Post} from '../../models/Post';
import {PostService} from '../../services/post.service';
import {ReplaySubject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {ActionResultStatus} from '../../models/Statuses/ActionResultStatus';
import {PostTypes} from '../../models/Statuses/PostTypes';
import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.css']
})
export class EditPostComponent implements OnInit {

  id: number;
  url: string;
  photoParam = new PhotoParam();
  isError = false;
  postInfo = new Post();
  postType = PostTypes;
  private destroyed$: ReplaySubject<void> = new ReplaySubject<void>();

  @ViewChild('description', {static: false}) descriptionInp: ElementRef;
  @ViewChild('mapElem', { static: false }) mapElem: ElementRef;
  map: mapboxgl.Map;
  marker: mapboxgl.Marker;
  lat = 53.902287;
  lng = 27.561824;


  ngAfterViewInit() {
    mapboxgl.accessToken = environment.mapToken;
    this.map = new mapboxgl.Map({
      container: this.mapElem.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      zoom: 12,
      center: [this.lng, this.lat]
    });
    this.map.addControl(new mapboxgl.NavigationControl());
    this.map.on('click', (e) => {this.AddMarker(e.lngLat)});

  }

  constructor(private activateRoute: ActivatedRoute, private postService: PostService,
              private router: Router) {
    this.id = activateRoute.snapshot.params['id'];
  }

  ngOnInit() {
    this.GetPost();
  }

  AddMarker(lngLat: any): void {
    if(this.marker) {
      this.marker.remove();
    }
    this.photoParam.lat_Location = lngLat.lat;
    this.photoParam.lng_Location = lngLat.lng;
    this.marker = new mapboxgl.Marker().setLngLat([lngLat.lng, lngLat.lat]).addTo(this.map);
  }

  GetPost() {
    this.postService.getPostById(this.id).pipe(
      takeUntil(this.destroyed$),
    ).subscribe((res) => {
      this.postInfo = res.post;
      this.photoParam = res.photoParam;
      this.url = this.postInfo.url_photo;
      this.descriptionInp.nativeElement.innerText = this.postInfo.description_post;

      if(this.photoParam.lat_Location && this.photoParam.lng_Location) {
        this.marker = new mapboxgl.Marker().setLngLat([this.photoParam.lng_Location, this.photoParam.lat_Location]).addTo(this.map);
        this.map.setCenter([this.photoParam.lng_Location, this.photoParam.lat_Location]);
      }

    });
  }

  UploadChanges() {
    this.postInfo.description_post = this.descriptionInp.nativeElement.innerText;
    this.postService.editPost(this.postInfo, this.photoParam).subscribe((res) => {
      if (res === ActionResultStatus.Success) {
        this.router.navigate(['my-posts']);
      } else {
        this.isError = true;
      }
    });
  }
}
