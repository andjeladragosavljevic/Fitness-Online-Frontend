import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Participation } from '../models/Participation';

@Injectable({
  providedIn: 'root',
})
export class ParticipationService {
  private baseUrl = 'http://localhost:8080/api/participations';

  constructor(private http: HttpClient) {}

  getUserParticipations(userId: number): Observable<Participation[]> {
    return this.http.get<Participation[]>(`${this.baseUrl}/user/${userId}`);
  }
}
