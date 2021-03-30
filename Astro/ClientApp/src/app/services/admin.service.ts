import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SERVER_API_URL} from '../app-injection-tokens';
import {Observable} from 'rxjs';
import {User} from '../models/User';
import {ActionResultStatus} from '../models/Statuses/ActionResultStatus';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient, @Inject(SERVER_API_URL) private apiUrl: string) { }
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl + `api/admin/get-users`);
  }
  addModer(id: number): Observable<ActionResultStatus> {
    return this.http.get<ActionResultStatus>(this.apiUrl + `api/admin/add-moder/${id}`);
  }
  deleteModer(id: number): Observable<ActionResultStatus> {
    return this.http.get<ActionResultStatus>(this.apiUrl + `api/admin/delete-moder/${id}`);
  }
}
