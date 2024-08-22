import { Component, OnInit } from '@angular/core';
import { Program } from '../models/Program';
import { ProgramService } from '../services/program.service';
import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { AppMaterialModule } from '../app-material/app-material.module';
import { RouterModule } from '@angular/router';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterComponent } from '../filter/filter.component';

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
    FilterComponent,
    FilterComponent,
  ],
  templateUrl: './program-list.component.html',
  styleUrl: './program-list.component.css',
})
export class ProgramListComponent implements OnInit {
  programs: Program[] = [];

  filters!: FormGroup;

  totalElements = 0;
  currentPage = 0;
  pageSize = 10;
  isLoading = true;
  error: string | null = null;

  ownPrograms = false;

  constructor(private programService: ProgramService) {}

  ngOnInit(): void {
    this.loadPrograms();
  }

  loadPrograms(): void {
    this.isLoading = true;
    this.programService
      .getPrograms(
        this.filters?.value,
        this.ownPrograms,
        this.currentPage,
        this.pageSize
      )
      .subscribe({
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

  onFiltersApplied(filters: any) {
    this.filters = filters;
    this.loadPrograms();
  }

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadPrograms();
  }
}
