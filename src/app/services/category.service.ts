import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../models/Category';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private http: HttpClient) {}
  url = 'http://localhost:8080/api/categories';

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.url);
  }
}
