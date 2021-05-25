import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SERVER_API_URL } from '../app-injection-tokens';
import { PostRatingContext } from '../models/PostRatingContext';

@Injectable({
  providedIn: 'root'
})
export class RatingService {

  constructor(private http: HttpClient, @Inject(SERVER_API_URL) private apiUrl) { }

  getPostRating(postId: number): Observable<PostRatingContext> {
    return this.http.get<PostRatingContext>(this.apiUrl + 'api/post/getrating/' + postId);
  }

  setPostRating(postId: number, rating: number): Observable<PostRatingContext> {
    const body = {
      postId: postId,
      rating: rating
    };
    return this.http.post<PostRatingContext>(this.apiUrl + 'api/post/setrating', body);
  }
}
