import {Component, Inject, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SERVER_API_URL} from '../../app-injection-tokens';
import exifr from 'exifr';
import {PhotoParam} from '../../models/PhotoParam';
import {AddPostInfo} from '../../models/AddPostInfo';


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
    this.photoParam.camera = `${allInfo.Make} ${allInfo.Model}`;
    this.photoParam.camera_lens = `${allInfo.LensModel}`;
    this.photoParam.aperture = `F${allInfo.FNumber}`;
    this.photoParam.ISO = allInfo.ISO;
    this.photoParam.exposition = allInfo.ExposureTime;
    this.photoParam.processing_photo = allInfo.Software;

    console.log(allInfo);

    // const f = new FormData();
    // f.append('file', this.file);
    // f.append('ISO', allInfo.ISO);
    // this.http.post(this.apiUrl + 'api/post/test', f).subscribe(res => {
    //   console.log(res);
    // });
  }

  test() {
    this.addPostInfo.photoParam = this.photoParam;
    this.addPostInfo.file = this.file;
    console.log(this.addPostInfo);

  }

}
