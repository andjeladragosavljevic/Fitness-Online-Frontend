import { Component } from '@angular/core';
import { AppMaterialModule } from '../app-material/app-material.module';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [AppMaterialModule, ReactiveFormsModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  readonly baseUrl = 'http://localhost:8080/api/users';
  profileForm!: FormGroup;

  userId = Number(localStorage.getItem('userId'));
  token = localStorage.getItem('token');

  id = 0;
  file!: string;
  imageUrl!: string;

  constructor(private http: HttpClient, private router: Router) {
    this.profileForm = new FormGroup({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl(''),
      avatar: new FormControl(''),
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0] as File;
    const formData = new FormData();
    formData.append('file', file);

    this.http
      .post(`http://localhost:8080/api/images/upload`, formData)
      .subscribe(
        (response: any) => {
          const reader = new FileReader();
          reader.onload = (e: any) => {
            this.file = e.target.result;
          };
          reader.readAsDataURL(file);
          this.imageUrl = response.url;
        },
        (error) => {
          console.error('Error uploading file:', error);
        }
      );
  }

  resetInput() {
    const input = document.getElementById(
      'avatar-input-file'
    ) as HTMLInputElement;
    if (input) {
      input.value = '';
    }
  }

  ngOnInit(): void {
    this.http
      .get(`${this.baseUrl}/profile/${this.userId}`)
      .subscribe((user: any) => {
        this.id = user.id;
        this.file = `http://localhost:8080${user.avatar}`;

        this.profileForm.setValue({
          firstName: user.firstName,
          lastName: user.lastName,
          city: user.city,
          email: user.email,
          password: '',

          avatar: user.avatar,
        });
      });
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      const profileData: any = {
        ...this.profileForm.value,
        id: this.id,
        avatar: this.imageUrl,
      };
      this.http.put(`${this.baseUrl}/profile/update`, profileData).subscribe(
        (response) => {
          alert('Profile updated successfully!');
        },
        (error) => {
          console.error(error);
          alert('Error updating profile');
        }
      );
    }
  }
}
