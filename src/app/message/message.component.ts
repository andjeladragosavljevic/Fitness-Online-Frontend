import { Component } from '@angular/core';
import { AppMaterialModule } from '../app-material/app-material.module';
import { Message } from '../models/Message';
import { MessageService } from '../services/message.service';
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../models/User';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [AppMaterialModule, NgFor, FormsModule],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css',
})
export class MessageComponent {
  users: User[] = [];
  selectedUser: User | null = null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAvailableUsers().subscribe((data) => {
      this.users = data;
    });
  }

  openChat(user: User): void {
    this.selectedUser = user;
  }
}
