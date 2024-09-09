import { Component, OnInit } from '@angular/core';
import { User } from '../models/User';
import { UserService } from '../services/user.service';
import { MessageService } from '../services/message.service';
import { MatDialogRef } from '@angular/material/dialog';
import { AppMaterialModule } from '../app-material/app-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Admin } from '../models/Admin';

@Component({
  selector: 'app-advisor-modal',
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule],
  templateUrl: './advisor-modal.component.html',
  styleUrl: './advisor-modal.component.css',
})
export class AdvisorModalComponent implements OnInit {
  advisors: Admin[] = [];
  selectedAdvisorId!: number;
  messageContent: string = '';

  constructor(
    private userService: UserService,
    private messageService: MessageService,
    public dialogRef: MatDialogRef<AdvisorModalComponent>
  ) {}

  ngOnInit(): void {
    this.loadAdvisors();
  }

  loadAdvisors(): void {
    this.userService.getAdvisors().subscribe({
      next: (advisors) => {
        this.advisors = advisors;
      },
      error: (err) => {
        console.error('Failed to load advisors', err);
      },
    });
  }

  sendMessage(): void {
    if (this.selectedAdvisorId && this.messageContent.trim()) {
      this.messageService
        .sendMessageToAdvisor(this.selectedAdvisorId, this.messageContent)
        .subscribe({
          next: () => {
            alert('Message sent successfully!');
            this.dialogRef.close();
          },
          error: (err) => {
            console.error('Failed to send message', err);
          },
        });
    }
  }
}
