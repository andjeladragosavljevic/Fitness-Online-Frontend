import { Component, OnInit } from '@angular/core';
import { Program } from '../models/Program';
import { ProgramService } from '../services/program.service';
import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { AppMaterialModule } from '../app-material/app-material.module';
import { RouterModule } from '@angular/router';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterComponent } from '../filter/filter.component';
import { PageEvent } from '@angular/material/paginator';

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

  length = 0;
  pageSize = 10;
  pageIndex = 0;
  pageEvent!: PageEvent;

  isDataLoaded = false;
  error: string | null = null;

  ownPrograms = false;

  constructor(private programService: ProgramService) {}

  ngOnInit(): void {
    this.loadPrograms();
  }

  loadPrograms(): void {
    this.programService
      .getPrograms(this.filters?.value, this.pageIndex, this.pageSize)
      .subscribe({
        next: (data) => {
          this.programs = data.content;
          this.length = data.totalElements;
          this.isDataLoaded = true;
        },
        error: (err) => {
          this.error = 'Failed to load your programs. Please try again later.';
          console.error(err);
          this.isDataLoaded = false;
        },
      });
  }

  onFiltersApplied(filters: any) {
    this.filters = filters;
    this.loadPrograms();
  }

  onPageChange(event: any): void {
    this.pageEvent = event;
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;

    this.loadPrograms();
  }
}
