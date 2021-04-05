import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SERVER_API_URL} from '../app-injection-tokens';
import {CreateComment} from '../models/CreateComment';
import {Observable} from 'rxjs';
import {ActionResultStatus} from '../models/Statuses/ActionResultStatus';
import {CommentInfo} from '../models/CommentInfo';
import {EditComment} from '../models/EditComment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private http: HttpClient, @Inject(SERVER_API_URL) private apiUrl: string) { }

  getComments(postId: number): Observable<CommentInfo[]> {
    return this.http.get<CommentInfo[]>(`${this.apiUrl}api/comment/get-comments/${postId}`);
  }

  addComment(createComment: CreateComment): Observable<CommentInfo> {
    return this.http.post<CommentInfo>(`${this.apiUrl}api/comment/add-comment`, createComment);
  }

  editComment(editComment: EditComment): Observable<ActionResultStatus> {
    return this.http.put<ActionResultStatus>(`${this.apiUrl}api/comment/edit-comment`, editComment);
  }
  deleteComment(commentId: number): Observable<ActionResultStatus> {
    return this.http.delete<ActionResultStatus>(`${this.apiUrl}api/comment/delete-comment/${commentId}`);
  }
}
