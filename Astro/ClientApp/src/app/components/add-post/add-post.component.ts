import {Component, Inject, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SERVER_API_URL} from '../../app-injection-tokens';

declare var EXIF: any;

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.css']
})
export class AddPostComponent implements OnInit {
  url;
  fileName;
  file;

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

  getExifData() {
    try {
      EXIF.getData(this.file, function () {
        console.log(EXIF.getAllTags(this));
      });
    } catch (e) {
      console.log(e);
    }
  }

}
