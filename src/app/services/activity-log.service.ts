import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivityLog } from '../models/ActivityLog';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ActivityLogService {
  private baseUrl = 'http://localhost:8080/api/activities';

  constructor(private http: HttpClient) {}

  addActivityLog(activityLog: ActivityLog): Observable<ActivityLog> {
    return this.http.post<ActivityLog>(`${this.baseUrl}`, activityLog);
  }

  getAllActivitiesByUserId(userId: number): Observable<ActivityLog[]> {
    return this.http.get<ActivityLog[]>(`${this.baseUrl}/user/${userId}`);
  }

  updateActivityLog(
    id: number,
    activityLog: ActivityLog
  ): Observable<ActivityLog> {
    return this.http.put<ActivityLog>(`${this.baseUrl}/${id}`, activityLog);
  }

  deleteActivityLog(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
