import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AppMaterialModule } from '../app-material/app-material.module';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

declare var grecaptcha: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [AppMaterialModule, FormsModule, ReactiveFormsModule],
})
export class LoginComponent implements OnInit {
  readonly baseUrl = 'http://localhost:8080/api/auth';
  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });
  constructor(
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService
  ) {}
  ngOnInit(): void {}

  public onLogin() {
    const loginData = {
      ...this.loginForm.value,
    };

    this.http.post(`${this.baseUrl}/login`, loginData).subscribe(
      (response: any) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('userId', response.id);
        localStorage.setItem('username', response.username);

        this.authService.checkLoginStatus();

        this.router.navigate(['/']);
      },
      (error) => {
        if (error.status === 403) {
          alert(
            'Account not activated. A new activation link has been sent to your email.'
          );
        } else {
          alert('Invalid credentials');
        }
      }
    );
  }
}
