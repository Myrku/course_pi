import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SERVER_API_URL} from '../app-injection-tokens';
import {Observable} from 'rxjs';
import {Post} from '../models/Post';
import {PhotoParam} from '../models/PhotoParam';
import {PostTypes} from '../models/Statuses/PostTypes';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http: HttpClient, @Inject(SERVER_API_URL) private apiUrl) { }

  getNextPosts(lastId: number): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl + 'api/post/getnextpost/' + lastId);
  }
  addPost(param: FormData): Observable<any> {
    return this.http.post(this.apiUrl + 'api/post/addpost', param);
  }
  getPostById(id: Number): Observable<any> {
    return this.http.get<any>(this.apiUrl + 'api/post/getpost/' + id);
  }
  editPost(postInfo: Post, photoParam: PhotoParam): Observable<any> {
    return this.http.put(this.apiUrl + 'api/post/editpost', {post: postInfo, photoParam: photoParam});
  }
  getMyPosts(): Observable<Post[]> {
    return this.http.get<Post[]>('https://localhost:44361/api/post/getpostsuser');
  }
  deletePostById(id: number): Observable<any> {
    return this.http.delete(this.apiUrl + 'api/post/deletepost/' + id);
  }
  addLikeForPost(id: number): Observable<any> {
    return this.http.get(this.apiUrl + 'api/post/setlike/' + id);
  }
  deleteLikeForPost(id: number): Observable<any> {
    return this.http.get(this.apiUrl + 'api/post/unlike/' + id);
  }
  getLikesByPostId(id: number): Observable<any> {
    return this.http.get(this.apiUrl + 'api/post/getlikes/' + id);
  }
  getPostsByType(type: PostTypes): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl + `api/post/getposts/${type}`);
  }
}
