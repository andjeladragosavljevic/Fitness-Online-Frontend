import { Component, ViewChild } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AppMaterialModule } from './app-material/app-material.module';
import { CommonModule } from '@angular/common';
import { UserForCommunicationComponent } from './user-for-communication/user-for-communication.component';
import { AuthService } from './services/auth.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';
import { AdvisorModalComponent } from './advisor-modal/advisor-modal.component';
import { MatDialog } from '@angular/material/dialog';
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
  @ViewChild('sidenav') sidenav!: MatSidenav;
  title = 'fitness-online';
  isLoggedIn = false;
  isMobile = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private dialog: MatDialog
  ) {
    this.breakpointObserver
      .observe([Breakpoints.Handset])
      .subscribe((result) => {
        this.isMobile = result.matches;
        if (this.isMobile && this.sidenav) {
          this.sidenav.close();
        }
      });
  }

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn;

    this.authService.loginStatusChanged.subscribe((status: boolean) => {
      this.isLoggedIn = status;
    });
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  openMessageModal(): void {
    this.dialog.open(AdvisorModalComponent, {
      width: '400px',
    });
  }
}
