import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AppMaterialModule } from '../app-material/app-material.module';
import {
  AbstractControlOptions,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { JsonPipe, NgFor, NgIf } from '@angular/common';
import { CategoryService } from '../services/category.service';
import { AttributeService } from '../services/attribute.service';
import { Attribute } from '../models/Attribute';
import { DifficultyLevel } from '../models/DifficultyLevel';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import 'moment/locale/fr';
import moment from 'moment';
import { ProgramStatus } from '../models/ProgramStatus';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [
    AppMaterialModule,
    ReactiveFormsModule,
    FormsModule,
    NgFor,
    NgIf,
    JsonPipe,
    MatMomentDateModule,
  ],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css',
})
export class FilterComponent implements OnInit {
  @Output() filtersApplied = new EventEmitter<FormGroup>();
  @Input() isOwnPrograms = true;
  categories: any[] = [];
  isLoading = true;
  error: string | null = null;
  specificAttributes: Attribute[] = [];
  difficultyLevels = Object.values(DifficultyLevel);
  programStatus = Object.values(ProgramStatus);

  filterForm!: FormGroup;

  constructor(
    private categoryService: CategoryService,
    private attributeService: AttributeService,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group(
      {
        name: [''],
        description: [''],
        location: [''],
        instructor: [''],
        difficultyLevel: [''],
        category: [''],
        startDate: [null],
        endDate: [null],
        minPrice: [''],
        maxPrice: [''],
        status: [''],
      },
      {
        validators: this.dateAndPriceValidator.bind(this),
      } as AbstractControlOptions
    );
  }

  onCategoryChange() {
    this.filterForm.get('category')?.valueChanges.subscribe((category) => {
      const specificAttributesGroup = new FormGroup({});

      this.attributeService
        .getAttributesForCategory(category)
        .subscribe((attributes) => {
          this.specificAttributes = attributes;

          attributes.forEach((attr) => {
            specificAttributesGroup.addControl(attr.name, new FormControl(''));
          });

          if (this.filterForm.contains('specificAttributes')) {
            this.filterForm.removeControl('specificAttributes');
          }

          this.filterForm.addControl(
            'specificAttributes',
            specificAttributesGroup
          );
        });
    });
  }

  dateAndPriceValidator(group: FormGroup): { [key: string]: boolean } | null {
    const startDate = group.get('startDate')?.value;
    const endDate = group.get('endDate')?.value;
    const minPrice = group.get('minPrice')?.value;
    const maxPrice = group.get('maxPrice')?.value;

    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      return { dateInvalid: true };
    }

    if (minPrice !== null && maxPrice !== null && minPrice > maxPrice) {
      return { priceInvalid: true };
    }

    return null;
  }

  applyFilters() {
    this.filterForm.value.startDate =
      this.filterForm.value.startDate != null
        ? moment(this.filterForm.value.startDate).format('YYYY-MM-DD')
        : null;
    this.filterForm.value.endDate =
      this.filterForm.value.endDate != null
        ? moment(this.filterForm.value.endDate).format('YYYY-MM-DD')
        : null;

    const specificAttributes = this.filterForm.get('specificAttributes')?.value;
    if (specificAttributes) {
      Object.keys(specificAttributes).forEach((key) => {
        const value = specificAttributes[key];
        if (value) {
          this.filterForm.value[`specificAttribute_${key}`] = value;
        }
      });
    }
    this.filtersApplied.emit(this.filterForm);
  }

  ngOnInit(): void {
    this.loadCategories();
    this.onCategoryChange();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (err) => {
        this.error = 'Failed to load categories';
        console.error(err);
        this.isLoading = false;
      },
    });
  }

  clearFilters() {
    this.filterForm.reset();
    if (this.filterForm.contains('specificAttributes')) {
      this.filterForm.removeControl('specificAttributes');
    }
  }
}
