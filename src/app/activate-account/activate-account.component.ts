import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppMaterialModule } from '../app-material/app-material.module';

@Component({
  selector: 'app-activate-account',
  standalone: true,
  imports: [AppMaterialModule],
  templateUrl: './activate-account.component.html',
  styleUrl: './activate-account.component.css',
})
export class ActivateAccountComponent implements OnInit {
  activationCode: string | null = null;
  activationMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activationCode = this.route.snapshot.queryParamMap.get('code');
    if (this.activationCode) {
      this.activateAccount(this.activationCode);
    }
  }

  activateAccount(code: string): void {
    this.http
      .get(`http://localhost:8080/api/auth/activate?code=${code}`, {
        responseType: 'text',
      })
      .subscribe(
        (response: string) => {
          this.activationMessage =
            'Your account has been successfully activated!';
          setTimeout(() => this.router.navigate(['/login']), 3000);
        },
        (error) => {
          this.activationMessage =
            'Activation failed. The activation code may be invalid or expired.';
        }
      );
  }
}
