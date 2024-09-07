import { Component, OnInit } from '@angular/core';
import { User } from '../models/User';
import { UserService } from '../services/user.service';
import { CommonModule } from '@angular/common';
import { NbChatModule, NbThemeModule } from '@nebular/theme';

@Component({
  selector: 'app-user-for-communication',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-for-communication.component.html',
  styleUrl: './user-for-communication.component.css',
})
export class UserForCommunicationComponent implements OnInit {
  users: User[] = [];
  selectedUser!: User;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAvailableUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  openChat(user: User) {
    this.selectedUser = user;
  }
}
