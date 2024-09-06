import { Component } from '@angular/core';
import { Message } from '../models/Message';
import { MessageService } from '../services/message.service';
import { DatePipe, NgFor } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-message-list',
  standalone: true,
  imports: [NgFor, FormsModule, ReactiveFormsModule, DatePipe],
  templateUrl: './message-list.component.html',
  styleUrl: './message-list.component.css',
})
export class MessageListComponent {
  messages: Message[] = [];
  messageForm: FormGroup;

  constructor(private messageService: MessageService, private fb: FormBuilder) {
    this.messageForm = this.fb.group({
      content: ['', Validators.required],
      senderId: [42],
      receiverId: [41],
    });
  }

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages() {
    this.messageService.getMessagesForUser(41).subscribe((messages) => {
      this.messages = messages;
    });
  }

  sendMessage() {
    if (this.messageForm.valid) {
      this.messageService.sendMessage(this.messageForm.value).subscribe(() => {
        this.messageForm.reset();
        this.loadMessages();
      });
    }
  }
}
