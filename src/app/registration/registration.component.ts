import { AfterViewInit, Component } from '@angular/core';
import { AppMaterialModule } from '../app-material/app-material.module';
import { NgClass, NgIf, NgStyle } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { Router } from '@angular/router';
import { User } from '../models/User';

declare var grecaptcha: any;

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
  imports: [
    AppMaterialModule,
    FormsModule,
    NgStyle,
    NgClass,
    NgIf,
    ReactiveFormsModule,
  ],
  standalone: true,
})
export class RegistrationComponent implements AfterViewInit {
  readonly baseUrl = 'http://localhost:8080/api';

  filePreviewUrl: string | ArrayBuffer | null = null;

  registrationForm = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    avatar: new FormControl(''),
  });
  file!: string;
  imageUrl!: string;
  captchaResponse: string | null = null;
  captchaWidgetId: any;

  constructor(private http: HttpClient, private router: Router) {}
  ngAfterViewInit(): void {
    if (typeof grecaptcha !== 'undefined' && !this.captchaWidgetId) {
      this.captchaWidgetId = grecaptcha.render('recaptcha-container', {
        sitekey: '6Lf9fDkqAAAAANwNMvWoB-l1jpVELZOqKaIIVzIX',
      });
    }
  }
  onFileChange(event: any) {
    const file = event.target.files[0] as File;
    const formData = new FormData();
    formData.append('file', file);

    this.http
      .post(`${this.baseUrl}/images/upload`, formData)
      .subscribe((response: any) => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.file = e.target.result;
        };
        reader.readAsDataURL(file);
        this.imageUrl = response.url;
      });
  }

  resetInput() {
    const input = document.getElementById(
      'avatar-input-file'
    ) as HTMLInputElement;
    if (input) {
      input.value = '';
    }
  }
  public handleCaptchaResponse(captchaResponse: string): void {
    this.captchaResponse = captchaResponse;
  }
  onSubmit(): void {
    const captchaResponse = grecaptcha.getResponse();

    if (captchaResponse.length === 0) {
      alert('Captcha not completed');
      return;
    }
    if (this.registrationForm.valid) {
      const registrationData: any = {
        ...this.registrationForm.value,
        avatar: this.imageUrl,
        captcha: captchaResponse,
      };

      this.http
        .post(`${this.baseUrl}/auth/registration`, registrationData)
        .subscribe(
          (response) => {
            alert(
              'Registration successful! Please check your email for activation link.'
            );
          },
          (error) => {
            console.error(error);
            alert('Registration failed. Please try again.');
          }
        );
    } else {
      alert('Please complete the form and CAPTCHA');
    }
  }
}
