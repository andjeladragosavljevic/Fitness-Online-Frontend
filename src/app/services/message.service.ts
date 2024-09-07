import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Message } from '../models/Message';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private baseUrl = 'http://localhost:8080/api/messages';

  constructor(private http: HttpClient) {}

  sendMessage(message: Message): Observable<Message> {
    return this.http.post<Message>(`${this.baseUrl}/send`, message);
  }

  getMessagesForUser(userId: number): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.baseUrl}/${userId}`);
  }

  markMessageAsRead(messageId: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/read/${messageId}`, {});
  }

  getMessagesBetweenUsers(
    senderId: number,
    receiverId: number
  ): Observable<Message[]> {
    return this.http.get<Message[]>(
      `/api/messages/between?senderId=${senderId}&receiverId=${receiverId}`
    );
  }
}
