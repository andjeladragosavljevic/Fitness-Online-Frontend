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

  getChatHistory(senderId: number, receiverId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/chat/${senderId}/${receiverId}`);
  }

  sendMessage(message: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}`, message);
  }

  markMessageAsRead(messageId: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/read/${messageId}`, {});
  }

  sendMessageToAdvisor(advisorId: number, content: string): Observable<any> {
    const senderId = Number(localStorage.getItem('userId'));
    const message = { advisorId, content, senderId };
    return this.http.post(`${this.baseUrl}/send`, message);
  }
}
