import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { Program } from '../models/Program';

@Injectable({
  providedIn: 'root',
})
export class ProgramService {
  readonly baseUrl = 'http://localhost:8080/api/programs';

  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  getAllPrograms(page: number, size: number): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<any>(this.baseUrl, { params });
  }

  getMyPrograms(page: number, size: number): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<any>(`${this.baseUrl}/my`, { params });
  }

  createProgram(program: Program): Observable<Program> {
    return this.http.post<Program>(this.baseUrl, program).pipe(
      tap(() => {
        this.snackBar.open('Program created successfully!', 'Close', {
          duration: 3000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      }),
      catchError((error) => {
        this.snackBar.open('Failed to create program!', 'Close', {
          duration: 3000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });

        return throwError(() => error);
      })
    );
  }

  getProgramById(id: number): Observable<Program> {
    return this.http.get<Program>(`${this.baseUrl}/${id}`);
  }

  deleteProgram(id: number): Observable<Program> {
    return this.http.delete<Program>(`${this.baseUrl}/${id}`);
  }

  getPrograms(
    filters: any,
    ownPrograms: boolean,
    page: number,
    size: number
  ): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('ownPrograms', ownPrograms.toString());

    if (filters && Object.keys(filters).length > 0) {
      Object.keys(filters)?.forEach((key) => {
        console.log('🚀 ~ ProgramService ~ Object.keys ~ filters:', filters);
        if (filters[key]) {
          params = params.set(key, filters[key]);
        }
      });
    }

    return this.http.get<any>(`${this.baseUrl}/filter`, { params });
  }
}
