import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import exifr from 'exifr';
import {PhotoParam} from '../../models/PhotoParam';
import {AddPostInfo} from '../../models/AddPostInfo';
import {NgxSpinnerService} from 'ngx-spinner';
import {PostService} from '../../services/post.service';
import {ReplaySubject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {ActionResultStatus} from '../../models/Statuses/ActionResultStatus';
import {PostTypes} from '../../models/Statuses/PostTypes';
import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.css']
})
export class AddPostComponent implements OnInit {
  url;
  fileName;
  file;
  photoParam = new PhotoParam();
  addPostInfo = new AddPostInfo();
  isSuccess = false;
  isError = false;
  postType = PostTypes;
  private destroyed$: ReplaySubject<void> = new ReplaySubject<void>();
  browseBtnLable: string;


  @ViewChild('mapElem', { static: false }) mapElem: ElementRef;
  map: mapboxgl.Map;
  marker: mapboxgl.Marker;
  lat = 53.902287;
  lng = 27.561824;
  
  constructor(public spinner: NgxSpinnerService, private postService: PostService,
    private userService: UserService) {
  }

  ngOnInit() {
    this.getUserCamera();
    navigator.geolocation.getCurrentPosition((position)=>{
      this.lat = position.coords.latitude;
      this.lng = position.coords.longitude;
    });
  }

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

  AddMarker(lngLat: any): void {
    if(this.marker) {
      this.marker.remove();
    }
    this.photoParam.lat_Location = lngLat.lat;
    this.photoParam.lng_Location = lngLat.lng;
    this.marker = new mapboxgl.Marker().setLngLat([lngLat.lng, lngLat.lat]).addTo(this.map);
  }

  onSelectFile(fileInput: any): void {
    this.file = <File>fileInput.target.files[0];
    this.fileName = this.file.name;
    const reader = new FileReader();
    reader.onload = () => {
      this.url = reader.result as string;
    };
    reader.readAsDataURL(this.file);
  }

  async getExifData() {
    const allInfo = await exifr.parse(this.file);
    this.photoParam.camera = `${allInfo.Make} ${allInfo.Model}`.includes('undefined') ? '' : `${allInfo.Make} ${allInfo.Model}`;
    this.photoParam.camera_lens = `${allInfo.LensModel}`.includes('undefined') ? '' : `${allInfo.LensModel}`;
    this.photoParam.aperture = `F${allInfo.FNumber}`.includes('undefined') ? '' : `F${allInfo.FNumber}`;
    this.photoParam.iso = `${allInfo.ISO}`.includes('undefined') ? '' : `${allInfo.ISO}`;
    this.photoParam.exposition = `${allInfo.ExposureTime}`.includes('undefined') ? '' : `${allInfo.ExposureTime}`;
    this.photoParam.processing_photo = `${allInfo.Software}`.includes('undefined') ? '' : `${allInfo.Software}`;
  }

  uploadPost(): void {
    this.addPostInfo.photoParam = this.photoParam;
    const req = JSON.stringify(this.addPostInfo);
    const formData = new FormData();
    formData.append('postParam', req);
    formData.append('uploadFile', this.file);
    this.spinner.show('publishPost');
    this.postService.addPost(formData).pipe(
      takeUntil(this.destroyed$),
    ).subscribe((res) => {
      if (res === ActionResultStatus.Success) {
        this.resetPostInfo();
      } else {
        this.isError = true;
        this.isSuccess = false;
      }
      this.spinner.hide('publishPost');
    }, error => this.spinner.hide('publishPost'));
  }

  resetPostInfo(): void {
    this.isSuccess = true;
    this.isError = false;
    this.addPostInfo = new AddPostInfo();
    this.photoParam = new PhotoParam();
    this.url = null;
    this.fileName = null;
  }

  getUserCamera(): void {
    this.userService.getCamera().pipe(
      takeUntil(this.destroyed$),
    ).subscribe((res) => {
      if (res) {
        this.photoParam.camera = res.camera;
        this.photoParam.camera_lens = res.cameraLens;
      }
    });
  }
}
