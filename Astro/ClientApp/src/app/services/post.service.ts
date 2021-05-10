import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SERVER_API_URL} from '../app-injection-tokens';
import {Observable} from 'rxjs';
import {Post} from '../models/Post';
import {PhotoParam} from '../models/PhotoParam';
import {PostTypes} from '../models/Statuses/PostTypes';
import {ActionResultStatus} from '../models/Statuses/ActionResultStatus';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http: HttpClient, @Inject(SERVER_API_URL) private apiUrl) { }

  getNextPosts(lastId: number): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl + 'api/post/getnextpost/' + lastId);
  }
  addPost(param: FormData): Observable<ActionResultStatus> {
    return this.http.post<ActionResultStatus>(this.apiUrl + 'api/post/addpost', param);
  }
  getPostById(id: Number): Observable<any> {
    return this.http.get<any>(this.apiUrl + 'api/post/getpost/' + id);
  }
  editPost(postInfo: Post, photoParam: PhotoParam): Observable<ActionResultStatus> {
    return this.http.put<ActionResultStatus>(this.apiUrl + 'api/post/editpost', {post: postInfo, photoParam: photoParam});
  }
  getMyPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl + 'api/post/getpostsuser');
  }
  deletePostById(id: number): Observable<ActionResultStatus> {
    return this.http.delete<ActionResultStatus>(this.apiUrl + 'api/post/deletepost/' + id);
  }
  addLikeForPost(id: number): Observable<ActionResultStatus> {
    return this.http.get<ActionResultStatus>(this.apiUrl + 'api/post/setlike/' + id);
  }
  deleteLikeForPost(id: number): Observable<ActionResultStatus> {
    return this.http.get<ActionResultStatus>(this.apiUrl + 'api/post/unlike/' + id);
  }
  getLikesByPostId(id: number): Observable<any> {
    return this.http.get(this.apiUrl + 'api/post/getlikes/' + id);
  }
  getPostsByType(type: PostTypes): Observable<Post[]> {
    return this.http.get<Post[]>( `${this.apiUrl}api/post/getposts/${type}`);
  }
  getPostByUserId(userId: number): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiUrl}api/post/get-user-posts/${userId}`);
  } 
}
