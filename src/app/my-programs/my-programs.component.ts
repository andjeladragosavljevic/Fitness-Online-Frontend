import { Component, OnInit } from '@angular/core';
import { Program } from '../models/Program';
import { ProgramService } from '../services/program.service';
import { AppMaterialModule } from '../app-material/app-material.module';
import { RouterModule } from '@angular/router';
import { CurrencyPipe, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-my-programs',
  standalone: true,
  imports: [AppMaterialModule, RouterModule, NgFor, NgIf, CurrencyPipe],
  templateUrl: './my-programs.component.html',
  styleUrl: './my-programs.component.css',
})
export class MyProgramsComponent implements OnInit {
  myPrograms: Program[] = [];
  totalElements = 0;
  currentPage = 0;
  pageSize = 10;
  isLoading = true;
  error: string | null = null;

  constructor(private programService: ProgramService) {}

  ngOnInit(): void {
    this.loadPrograms();
  }

  loadPrograms(): void {
    this.isLoading = true;
    this.programService.getPrograms(this.currentPage, this.pageSize).subscribe({
      next: (data) => {
        this.myPrograms = data.content;
        this.totalElements = data.totalElements;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load your programs. Please try again later.';
        this.isLoading = false;
      },
    });
  }

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
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
}
