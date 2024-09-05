import { Component } from '@angular/core';
import { AppMaterialModule } from '../app-material/app-material.module';
import { Message } from '../models/Message';
import { MessageService } from '../services/message.service';
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [AppMaterialModule, NgFor, FormsModule],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css',
})
export class MessageComponent {
  messages: Message[] = [];
  newMessageContent: string = '';
  selectedUserId: number = 41;

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages() {
    this.messageService
      .getMessagesForUser(this.selectedUserId)
      .subscribe((messages) => {
        this.messages = messages;
      });
  }

  sendMessage() {
    if (this.newMessageContent.trim()) {
      this.messageService
        .sendMessage(this.selectedUserId, 42, this.newMessageContent)
        .subscribe(() => {
          this.newMessageContent = '';
          this.loadMessages();
        });
    }
  }
}
