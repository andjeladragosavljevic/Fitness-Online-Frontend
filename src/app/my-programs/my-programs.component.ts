import { Component, Input, OnInit } from '@angular/core';
import { Program } from '../models/Program';
import { ProgramService } from '../services/program.service';
import { AppMaterialModule } from '../app-material/app-material.module';
import { RouterModule } from '@angular/router';
import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { FilterComponent } from '../filter/filter.component';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-my-programs',
  standalone: true,
  imports: [
    AppMaterialModule,
    RouterModule,
    NgFor,
    NgIf,
    CurrencyPipe,
    FilterComponent,
    FilterComponent,
  ],
  templateUrl: './my-programs.component.html',
  styleUrl: './my-programs.component.css',
})
export class MyProgramsComponent implements OnInit {
  @Input() isOwnPrograms = true;
  myPrograms: Program[] = [];

  filters!: FormGroup;

  length = 50;
  pageSize = 10;
  pageIndex = 0;
  pageEvent!: PageEvent;

  isDataLoaded = false;
  error: string | null = null;

  ownPrograms = true;

  constructor(private programService: ProgramService) {}

  ngOnInit(): void {
    this.loadPrograms();
  }

  loadPrograms(): void {
    this.programService
      .getMyPrograms(this.filters?.value, this.pageIndex, this.pageSize)
      .subscribe({
        next: (data) => {
          this.myPrograms = data.content;
          this.length = data.totalElements;
          this.isDataLoaded = true;
        },
        error: (err) => {
          this.error = 'Failed to load your programs. Please try again later.';
          this.isDataLoaded = false;
        },
      });
  }

  onPageChange(event: PageEvent): void {
    this.pageEvent = event;
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;

    this.loadPrograms();
  }

  deleteProgram(id: number): void {
    if (confirm('Are you sure you want to delete this program?')) {
      this.programService.deleteProgram(id).subscribe({
        next: () => {
          this.myPrograms = this.myPrograms.filter(
            (program) => program.id !== id
          );
          this.loadPrograms();
          alert('Program deleted successfully.');
        },
        error: (err) => {
          console.error('Failed to delete program', err);
          alert('Failed to delete the program.');
        },
      });
    }
  }

  onFiltersApplied(filters: any) {
    this.filters = filters;
    this.loadPrograms();
  }
}
