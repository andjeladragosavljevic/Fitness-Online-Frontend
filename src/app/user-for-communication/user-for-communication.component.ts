import { Component, OnInit } from '@angular/core';
import { User } from '../models/User';
import { UserService } from '../services/user.service';
import { CommonModule } from '@angular/common';
import { NbChatModule, NbThemeModule } from '@nebular/theme';
import { Router } from '@angular/router';
import { AppMaterialModule } from '../app-material/app-material.module';

@Component({
  selector: 'app-user-for-communication',
  standalone: true,
  imports: [CommonModule, AppMaterialModule],
  templateUrl: './user-for-communication.component.html',
  styleUrl: './user-for-communication.component.css',
})
export class UserForCommunicationComponent implements OnInit {
  availableUsers: User[] = [];
  selectedUser!: User;
  currentUserId = Number(localStorage.getItem('userId')) || 0;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAvailableUsers().subscribe({
      next: (users) => {
        this.availableUsers = users;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  openChat(userId: number): void {
    this.router.navigate(['/chat', userId]);
  }
}
