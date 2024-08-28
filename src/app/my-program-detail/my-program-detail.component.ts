import { Component, OnInit } from '@angular/core';
import { Program } from '../models/Program';
import { ActivatedRoute, Router } from '@angular/router';
import { ProgramService } from '../services/program.service';
import { CurrencyPipe, NgFor, NgIf, NgStyle } from '@angular/common';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { AppMaterialModule } from '../app-material/app-material.module';
import { CommentListComponent } from '../comment-list/comment-list.component';

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
  ],
  templateUrl: './my-program-detail.component.html',
  styleUrl: './my-program-detail.component.css',
})
export class MyProgramDetailComponent implements OnInit {
  program: Program | undefined;
  isLoading = true;
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
    private router: Router
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
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load program details.';
        console.log(err);
        this.isLoading = false;
      },
    });
  }

  editProgram(program: Program): void {
    this.router.navigate(['/new-program'], { state: { program } });
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
}
