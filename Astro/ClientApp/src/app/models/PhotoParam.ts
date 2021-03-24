import {PostTypes} from './Statuses/PostTypes';

export class PhotoParam {
  constructor() {
  }
  camera: string;
  camera_lens: string;
  iso: string;
  exposition: string;
  aperture: string;
  processing_photo: string;
  post_type: PostTypes;
}
