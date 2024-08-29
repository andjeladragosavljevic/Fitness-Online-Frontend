import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { AppMaterialModule } from '../app-material/app-material.module';
import { NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import {
  AbstractControlOptions,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  NgForm,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Navigation, Route, Router } from '@angular/router';
import { ProgramService } from '../services/program.service';
import { CategoryService } from '../services/category.service';
import { Category } from '../models/Category';
import { HttpClient } from '@angular/common/http';
import { Program } from '../models/Program';

import { SlickCarouselModule } from 'ngx-slick-carousel';
import { Attribute } from '../models/Attribute';
import { AttributeService } from '../services/attribute.service';
import { DifficultyLevel } from '../models/DifficultyLevel';

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
  @ViewChild('form') form!: NgForm;
  addForm!: FormGroup;
  difficultyLevels = Object.values(DifficultyLevel);
  readonly baseUrl = 'http://localhost:8080';

  programService = inject(ProgramService);
  program: Program | undefined;
  programId = -1;
  categoryService = inject(CategoryService);
  categories: Category[] = [];
  specificAttributes: Attribute[] = [];
  showLinkField: boolean = false;
  isEditMode: boolean = false;

  navigation: Navigation | null = null;
  slideConfig = {
    slidesToShow: 2,
    slidesToScroll: 1,
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 2000,
  };

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private http: HttpClient,
    private attributeService: AttributeService,
    private router: Router
  ) {
    this.navigation = this.router.getCurrentNavigation();
    this.programId = Number(this.route.snapshot.params['id']);

    this.addForm = this.fb.group(
      {
        name: ['', Validators.required],
        description: [''],
        categoryId: ['', Validators.required],
        difficultyLevel: ['', Validators.required],
        price: ['', Validators.required],
        location: ['', Validators.required],
        contact: ['', Validators.required],
        images: [''],
        userId: ['', Validators.required],
        startDate: ['', Validators.required],
        endDate: ['', Validators.required],
        youtubeLink: [''],
      },
      {
        validators: this.dateValidator.bind(this),
      } as AbstractControlOptions
    );
  }

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    console.log(
    if (
      this.navigation &&
      this.navigation.extras &&
      this.navigation.extras.state
    ) {
      const program = this.navigation.extras.state['program'] as Program;

      console.log('🚀 ~ AddProgramComponent ~ ngOnInit ~ program:', program);
      if (program) {
        const programData: Program = {
          ...program,
          images: this.imageUrls,
          categoryId: program.category.id,

          // specificAttributes: specificAttributesArray,
        } as Program;
        this.files = program.images.map((img) => {
          return `${this.baseUrl}${img}`;
        });

        console.log('Program data:', program.name);
        this.addForm.patchValue(programData);
        this.imageUrls = program.images;
        this.isEditMode = true;
      }
    }

    this.loadCategories();
    this.onCategoryChange();
    this.onLocationChange();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  files: string[] = [];
  imageUrls: string[] = [];

  onCategoryChange() {
    this.addForm.get('categoryId')?.valueChanges.subscribe((category) => {
      const specificAttributesGroup = new FormGroup({});

      this.attributeService
        .getAttributesForCategory(category)
        .subscribe((attributes) => {
          this.specificAttributes = attributes;

          attributes.forEach((attr) => {
            specificAttributesGroup.addControl(attr.name, new FormControl(''));
          });

          if (this.addForm.contains('specificAttributes')) {
            this.addForm.removeControl('specificAttributes');
          }

          this.addForm.addControl(
            'specificAttributes',
            specificAttributesGroup
          );
        });
    });
  }

  onLocationChange() {
    this.addForm.get('location')?.valueChanges.subscribe((location) => {
      this.showLinkField = (location as string).toLowerCase() === 'online';
    });
  }

  onFileChange(event: any) {
    const files = event.target.files as FileList;

    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append('file', files[i]);

        this.http
          .post(`${this.baseUrl}/api/images/upload`, formData)
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
    console.log(
      '🚀 ~ AddProgramComponent ~ onSubmit ~ (this.addForm:',
      this.addForm
    );

    if (this.addForm.valid) {
      const specificAttributesArray = this.addForm.value.specificAttributes
        ? Object.keys(this.addForm.value.specificAttributes).map((key) => ({
            name: key,
            value: this.addForm.value.specificAttributes[key],
          }))
        : [];

      const programData: Program = {
        ...this.addForm.value,
        images: this.imageUrls,
        specificAttributes: specificAttributesArray,
      } as Program;
      console.log(
        '🚀 ~ AddProgramComponent ~ onSubmit ~ programData:',
        programData
      );
      if (this.isEditMode && programData.id) {
        // Update existing program
        this.programService.updateProgram(programData).subscribe(
          () => {
            this.form.resetForm();
            this.resetInput();
            this.router.navigate(['/programs']); // Redirect after update
          },
          (error: any) => {
            console.error(error);
          }
        );
      } else {
        // Create new program
        this.programService.createProgram(programData).subscribe(
          () => {
            this.form.resetForm();
            this.resetInput();
            this.router.navigate(['/programs']); // Redirect after creation
          },
          (error) => {
            console.error(error);
          }
        );
      }
    }
  }

  dateValidator(group: FormGroup): { [key: string]: boolean } | null {
    const startDate = group.get('startDate')?.value;
    const endDate = group.get('endDate')?.value;

    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      return { dateInvalid: true };
    }

    return null;
  }
}
