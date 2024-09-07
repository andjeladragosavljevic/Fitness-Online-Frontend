import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AppMaterialModule } from './app-material/app-material.module';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from './services/user.service';
import { User } from './models/User';
import { CommonModule } from '@angular/common';
import { UserForCommunicationComponent } from './user-for-communication/user-for-communication.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HomeComponent,
    AppMaterialModule,
    RouterModule,
    CommonModule,
    UserForCommunicationComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'fitness-online';

  constructor() {}
}
