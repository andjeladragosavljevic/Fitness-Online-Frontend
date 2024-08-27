import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Comment } from '../models/Comment';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  constructor(private http: HttpClient) {}
  url = 'http://localhost:8080/api/comments';

  getCommentsByProgram(programId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.url}/${programId}`);
  }

  createComment(
    userId: number,
    fitnessProgramId: number,
    content: string
  ): Observable<any> {
    const body = { userId, fitnessProgramId, content };

    return this.http.post(this.url, body);
  }

  deleteComment(commentId: number) {
    return this.http.delete(`${this.url}/${commentId}`);
  }
}
