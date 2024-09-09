import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from '../services/message.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AppMaterialModule } from '../app-material/app-material.module';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, CommonModule, AppMaterialModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent implements OnInit {
  messages: any[] = [];
  receiverId: number = -1;
  senderId: number;
  newMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {
    this.senderId = parseInt(localStorage.getItem('userId') || '0', 10);
  }

  ngOnInit(): void {
    this.receiverId = parseInt(this.route.snapshot.paramMap.get('userId')!, 10);
    this.loadChatHistory();
  }

  loadChatHistory(): void {
    this.messageService
      .getChatHistory(this.senderId, this.receiverId)
      .subscribe((data: any[]) => {
        this.messages = data;
      });
  }

  sendMessage(): void {
    if (this.newMessage.trim()) {
      this.messageService
        .sendMessage({
          senderId: this.senderId,
          receiverId: this.receiverId,
          content: this.newMessage,
        })
        .subscribe(() => {
          this.loadChatHistory();
          this.newMessage = '';
        });
    }
  }
}
