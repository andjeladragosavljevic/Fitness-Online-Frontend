import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Message } from '../models/Message';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private apiUrl = 'http://localhost:8080/api/messages';

  constructor(private http: HttpClient) {}

  sendMessage(
    senderId: number,
    receiverId: number,
    content: string
  ): Observable<Message> {
    return this.http.post<Message>(`${this.apiUrl}/send`, {
      senderId,
      receiverId,
      content,
    });
  }

  getMessagesForUser(userId: number): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/inbox/${userId}`);
  }

  markMessageAsRead(messageId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/read/${messageId}`, {});
  }
}
