import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {SERVER_API_URL} from '../app-injection-tokens';
import {Observable} from 'rxjs';
import {ActionResultStatus} from '../models/Statuses/ActionResultStatus';
import {Post} from '../models/Post';
import {toNumbers} from '@angular/compiler-cli/src/diagnostics/typescript_version';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private http: HttpClient, @Inject(SERVER_API_URL) private apiUrl) { }

  addReport(postId: number): Observable<ActionResultStatus> {
    return this.http.post<ActionResultStatus>(`${this.apiUrl}api/report/add-report`, Number(postId));
  }
  deleteReport(postId: number): Observable<ActionResultStatus> {
    return this.http.delete<ActionResultStatus>(`${this.apiUrl}api/report/delete-report/${postId}`);
  }
  getReports(isActive: boolean): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiUrl}api/report/get-reports?isActive=${isActive}`);
  }
  isReport(postId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}api/report/isReported/${postId}`)
  }
}
