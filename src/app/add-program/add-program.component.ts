import { Component, OnInit, inject } from '@angular/core';
import { AppMaterialModule } from '../app-material/app-material.module';
import { NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProgramService } from '../services/program.service';
import { CategoryService } from '../services/category.service';
import { Category } from '../models/Category';
import { HttpClient } from '@angular/common/http';
import { Program } from '../models/Program';

import { SlickCarouselModule } from 'ngx-slick-carousel';

@Component({
  selector: 'app-add-program',
  standalone: true,
  imports: [
    AppMaterialModule,
    NgIf,
    NgClass,
    NgStyle,
    FormsModule,
    NgFor,
    ReactiveFormsModule,
    SlickCarouselModule,
  ],
  templateUrl: './add-program.component.html',
  styleUrl: './add-program.component.css',
  providers: [CategoryService, ProgramService],
})
export class AddProgramComponent implements OnInit {
  addForm!: FormGroup;
  difficultyLevels = ['Beginner', 'Intermediate', 'Advanced'];
  readonly baseUrl = 'http://localhost:8080/api/images';

  route: ActivatedRoute = inject(ActivatedRoute);
  programService = inject(ProgramService);
  program: Program | undefined;
  programId = -1;
  categoryService = inject(CategoryService);
  categories: Category[] = [];

  slideConfig = {
    slidesToShow: 2,
    slidesToScroll: 1,
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 2000,
  };

  constructor(private http: HttpClient) {
    this.programId = Number(this.route.snapshot.params['id']);
    // this.program = this.programService.geProgramById(this.programId);
  }
  ngOnInit(): void {
    this.categoryService.getCategories().subscribe((data) => {
      this.categories = data;
    });
    this.createForm();
  }

  files: string[] = [];
  imageUrls: string[] = [];

  onFileChange(event: any) {
    const files = event.target.files as FileList;

    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append('file', files[i]);

        this.http
          .post(`${this.baseUrl}/upload`, formData)
          .subscribe((response: any) => {
            const reader = new FileReader();
            reader.onload = (e: any) => {
              this.files.push(e.target.result);
            };
            reader.readAsDataURL(files[i]);
            this.imageUrls.push(response.url);
          });
      }
    }
  }
  resetInput() {
    const input = document.getElementById(
      'avatar-input-file'
    ) as HTMLInputElement;
    if (input) {
      input.value = '';
    }
  }

  onSubmit(): void {
    if (this.addForm.valid) {
      const programData: Program = {
        ...this.addForm.value,
        categoryId: Number(this.addForm.value.categoryId),
        price: Number(this.addForm.value.price),
        duration: Number(this.addForm.value.duration),
        images: this.imageUrls,
      } as Program;

      this.programService.createProgram(programData).subscribe(
        (response) => {
          this.addForm.reset();
          this.resetInput();
          this.createForm();
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }

  createForm() {
    return (this.addForm = new FormGroup({
      name: new FormControl('', Validators.required),
      description: new FormControl(''),
      categoryId: new FormControl('', Validators.required),
      difficultyLevel: new FormControl('', Validators.required),

      price: new FormControl('', Validators.required),
      location: new FormControl('', Validators.required),
      contact: new FormControl('', Validators.required),
      images: new FormControl(''),
      userId: new FormControl(30, Validators.required),
      startDate: new FormControl(),
      endDate: new FormControl(),
      //1
    }));
  }
}
