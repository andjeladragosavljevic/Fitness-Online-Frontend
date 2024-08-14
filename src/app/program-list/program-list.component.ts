import { Component, OnInit } from '@angular/core';
import { Program } from '../models/Program';
import { ProgramService } from '../services/program.service';
import { NgFor, NgIf } from '@angular/common';
import { AppMaterialModule } from '../app-material/app-material.module';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-program-list',
  standalone: true,
  imports: [NgIf, AppMaterialModule, RouterModule, NgFor],
  templateUrl: './program-list.component.html',
  styleUrl: './program-list.component.css',
})
export class ProgramListComponent implements OnInit {
  programs: Program[] = [];
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
        this.programs = data.content;
        this.totalElements = data.totalElements;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load programs. Please try again later.';
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
