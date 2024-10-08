import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Program } from '../models/Program';
import { ActivatedRoute, Router } from '@angular/router';
import { ProgramService } from '../services/program.service';
import { CurrencyPipe, DatePipe, NgFor, NgIf, NgStyle } from '@angular/common';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { AppMaterialModule } from '../app-material/app-material.module';
import { CommentListComponent } from '../comment-list/comment-list.component';
import moment, { Moment } from 'moment';
import { MatMomentDateModule } from '@angular/material-moment-adapter';

@Component({
  selector: 'app-my-program-detail',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    SlickCarouselModule,
    CurrencyPipe,
    NgStyle,
    AppMaterialModule,
    CommentListComponent,
    MatMomentDateModule,
    DatePipe,
  ],
  templateUrl: './my-program-detail.component.html',
  styleUrl: './my-program-detail.component.css',
})
export class MyProgramDetailComponent implements OnInit {
  program: Program | undefined;
  isDataLoaded = true;
  error: string | null = null;

  baseUrl = 'http://localhost:8080';
  sanitizedImages: string[] = [];

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
    private programService: ProgramService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadProgramDetails(id);
    }
  }

  loadProgramDetails(id: number) {
    this.programService.getProgramById(id).subscribe({
      next: (data) => {
        this.program = data;

        this.sanitizedImages = data.images.map((img) => {
          return `${this.baseUrl}${img}`;
        });
        this.isDataLoaded = true;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'Failed to load program details.';
        console.log(err);
        this.isDataLoaded = false;
      },
    });
  }

  editProgram(program: Program): void {
    this.router.navigate(['/edit-program'], { state: { program } });
  }

  getColor(difficulty: string | undefined): string {
    switch (difficulty) {
      case 'Beginner':
        return 'green';
      case 'Intermediate':
        return 'orange';
      case 'Advanced':
        return 'red';
      default:
        return 'black';
    }
  }

  deleteProgram(id: number): void {
    if (confirm('Are you sure you want to delete this program?')) {
      this.programService.deleteProgram(id).subscribe({
        next: () => {
          this.router.navigate(['/my-programs']);

          alert('Program deleted successfully.');
        },
        error: (err) => {
          console.error('Failed to delete program', err);
          alert('Failed to delete the program.');
        },
      });
    }
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}
