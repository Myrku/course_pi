import {Component, Inject, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {SERVER_API_URL} from '../../app-injection-tokens';
import exifr from 'exifr';
import {PhotoParam} from '../../models/PhotoParam';
import {AddPostInfo} from '../../models/AddPostInfo';
import {transcode} from 'buffer';


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

  constructor(private http: HttpClient, @Inject(SERVER_API_URL) private apiUrl) {

  }

  ngOnInit() {

  }

  onSelectFile(fileInput: any) {
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

  uploadPost() {
    this.addPostInfo.photoParam = this.photoParam;
    console.log(this.addPostInfo);
    const req = JSON.stringify(this.addPostInfo);
    console.log(req);
    const f = new FormData();
    f.append('param_post', req);
    f.append('upload_file', this.file);
    console.log(f);
    this.http.post(this.apiUrl + 'api/post/addpost', f).subscribe(res => {
      console.log(res);
      // @ts-ignore
      if (res.status === 'Success') {
        this.isSuccess = true;
        this.isError = false;
        this.addPostInfo = new AddPostInfo();
        this.photoParam = new PhotoParam();
        this.url = null;
        this.fileName = null;
      } else {
        this.isError = true;
        this.isSuccess = false;
      }
    });
  }

}
