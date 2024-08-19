import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Attribute } from '../models/Attribute';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AttributeService {
  constructor(private http: HttpClient) {}
  url = 'http://localhost:8080/api/attributes';

  getAttributesForCategory(id: number): Observable<Attribute[]> {
    return this.http.get<Attribute[]>(`${this.url}/${id}`);
  }
}
