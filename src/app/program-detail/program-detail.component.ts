import { Component } from '@angular/core';
import { Program } from '../models/Program';
import { ActivatedRoute } from '@angular/router';
import { ProgramService } from '../services/program.service';
import { CurrencyPipe, DatePipe, NgFor, NgIf, NgStyle } from '@angular/common';
import { AppMaterialModule } from '../app-material/app-material.module';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { MatDialog } from '@angular/material/dialog';
import { PaymentMethodComponent } from '../payment-method/payment-method.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommentListComponent } from '../comment-list/comment-list.component';
import moment from 'moment';
import { ParticipationService } from '../services/participation.service';

@Component({
  selector: 'app-program-detail',
  standalone: true,
  imports: [
    NgIf,
    AppMaterialModule,
    NgFor,
    SlickCarouselModule,
    CurrencyPipe,
    NgStyle,
    CommentListComponent,
    DatePipe,
  ],
  templateUrl: './program-detail.component.html',
  styleUrl: './program-detail.component.css',
})
export class ProgramDetailComponent {
  program: Program | undefined;
  isDataLoaded = true;
  error: string | null = null;
  currentDate = new Date();
  endDate = new Date();

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
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private participationService: ParticipationService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadProgramDetails(id);
    }
  }

  loadProgramDetails(id: number): void {
    this.programService.getProgramById(id).subscribe({
      next: (data) => {
        this.program = data;
        this.endDate = new Date(data.endDate);

        this.sanitizedImages = data.images.map((img) => {
          return `${this.baseUrl}${img}`;
        });
        this.isDataLoaded = true;
      },
      error: (err) => {
        this.error = 'Failed to load program details.';
        console.error(err);
        this.isDataLoaded = false;
      },
    });
  }

  isProgramCompleted() {
    return this.currentDate > this.endDate;
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

  openPaymentModal() {
    let id = this.program?.id ?? 0;
    const dialogRef = this.dialog.open(PaymentMethodComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.participationService
          .participateInProgram(41, id, result.paymentMethod)
          .subscribe({
            next: (response) => {
              if (
                (response.fitnessprogram.location as string).toLowerCase() ===
                'online'
              ) {
                this.snackBar.open(
                  'You have successfully joined the program.',
                  'Close',
                  { duration: 3000 }
                );
                window.open(response.fitnessprogram.youtubeLink, '_blank');
              } else {
                this.snackBar.open(
                  'You have successfully joined the program. Visit the location on the scheduled date.',
                  'Close',
                  { duration: 3000 }
                );
              }
            },
            error: (err) => {
              this.snackBar.open(
                'Failed to participate in the program. Please try again later.',
                'Close',
                { duration: 3000 }
              );
            },
          });
      }
    });
  }
}
