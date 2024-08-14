import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExerciseListService {
  private url = 'https://api.api-ninjas.com/v1/exercises';

  constructor(private http: HttpClient) {}

  getExercises(): Observable<Exercise[]> {
    const headers = new HttpHeaders().set(
      'X-Api-Key',
      '0a1HVqpmwpubUtxemK4pzg==T1FaGhO1Vs72QItN'
    );

    return this.http.get<Exercise[]>(this.url, { headers }).pipe(
      catchError((error) => {
        console.error('Error loading exercises:', error);
        return of([]);
      })
    );
  }
}

export interface Exercise {
  name: string;
  type: string;
  difficulty: string;
  instructions: string;
  category: string;
  equipment: string[];
  muscles: string[];
}
