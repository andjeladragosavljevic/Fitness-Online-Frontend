import { Component, OnInit } from '@angular/core';
import { Program } from '../models/Program';
import { ProgramService } from '../services/program.service';
import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { AppMaterialModule } from '../app-material/app-material.module';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CategoryService } from '../services/category.service';

@Component({
  selector: 'app-program-list',
  standalone: true,
  imports: [
    NgIf,
    AppMaterialModule,
    RouterModule,
    NgFor,
    CurrencyPipe,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './program-list.component.html',
  styleUrl: './program-list.component.css',
})
export class ProgramListComponent implements OnInit {
  programs: Program[] = [];
  categories: any[] = [];
  specificAttributes = [{ name: 'brand' }, { name: 'material' }];
  filters: Record<string, any> = {
    category: '',
    difficulty: '',
    location: '',
    minPrice: undefined,
    maxPrice: undefined,
  };
  totalElements = 0;
  currentPage = 0;
  pageSize = 10;
  isLoading = true;
  error: string | null = null;

  constructor(
    private programService: ProgramService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.loadPrograms();
    this.loadCategories();
  }

  applyFilters(): void {
    this.loadPrograms();
  }

  loadPrograms(): void {
    this.isLoading = true;
    this.programService.getPrograms(this.currentPage, this.pageSize).subscribe({
      next: (data) => {
        this.programs = data.content;
        this.totalElements = data.totalElements;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load programs';
        console.error(err);
        this.isLoading = false;
      },
    });
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (err) => {
        this.error = 'Failed to load programs';
        console.error(err);
        this.isLoading = false;
      },
    });
  }

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadPrograms();
  }
}
