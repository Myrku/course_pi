import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SERVER_API_URL } from '../app-injection-tokens';
import { ActionResultStatus } from '../models/Statuses/ActionResultStatus';
import { CameraInfo, UserPageContext } from '../models/UserPageContext';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, @Inject(SERVER_API_URL) private apiUrl) { }

  getContext(): Observable<UserPageContext> {
    return this.http.get<UserPageContext>(`${this.apiUrl}api/user/`);
  }

  setCamera(cameraInfo: CameraInfo): Observable<ActionResultStatus> {
    return this.http.post<ActionResultStatus>(`${this.apiUrl}api/user/set-camera`, cameraInfo);
  }

  getCamera(): Observable<CameraInfo> {
    return this.http.get<CameraInfo>(`${this.apiUrl}api/user/get-user-camera`);
  }
}
