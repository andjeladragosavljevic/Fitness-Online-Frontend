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
  userId = Number(localStorage.getItem('userId')) || 0;

  readonly baseUrl = 'http://localhost:8080/api/programs';

  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {
    if (typeof window !== 'undefined') {
      this.userId = Number(localStorage.getItem('userId'));
    }
  }

  getAllPrograms(page: number, size: number): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<any>(`this.baseUrl/${this.userId}`, { params });
  }

  createProgram(program: Program): Observable<Program> {
    return this.http.post<Program>(this.baseUrl, program).pipe(
      tap(() => {
        this.snackBar.open('Program created successfully!', 'Close', {
          duration: 3000,
        });
      }),
      catchError((error) => {
        this.snackBar.open('Failed to create program!', 'Close', {
          duration: 3000,
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

  getPrograms(filters: any, page: number, size: number): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (filters) {
      Object.keys(filters).forEach((key) => {
        if (filters[key]) {
          params = params.append(key, filters[key]);
        }
      });
    }

    return this.http.get<any>(`${this.baseUrl}/other-programs/${this.userId}`, {
      params,
    });
  }

  getMyPrograms(filters: any, page: number, size: number): Observable<any> {
    this.userId = Number(localStorage.getItem('userId')) || 0;

    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (filters) {
      Object.keys(filters).forEach((key) => {
        if (filters[key]) {
          params = params.append(key, filters[key]);
        }
      });
    }
    return this.http.get<any>(`${this.baseUrl}/my-programs/${this.userId}`, {
      params,
    });
  }

  updateProgram(program: Program): Observable<Program> {
    const url = `${this.baseUrl}/${program.id}`;
    return this.http.put<Program>(url, program);
  }
}
