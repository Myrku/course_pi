import {PhotoParam} from './PhotoParam';
import {PostTypes} from './Statuses/PostTypes';

export class AddPostInfo {
  constructor() {
  }
  title_post: string;
  description_post: string;
  photoParam: PhotoParam;
  postTypeId: PostTypes;
}
