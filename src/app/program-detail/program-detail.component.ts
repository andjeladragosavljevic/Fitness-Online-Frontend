import { Component } from '@angular/core';
import { Program } from '../models/Program';
import { ActivatedRoute } from '@angular/router';
import { ProgramService } from '../services/program.service';
import { CurrencyPipe, NgFor, NgIf, NgStyle } from '@angular/common';
import { AppMaterialModule } from '../app-material/app-material.module';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PaymentMethodComponent } from '../payment-method/payment-method.component';

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
  ],
  templateUrl: './program-detail.component.html',
  styleUrl: './program-detail.component.css',
})
export class ProgramDetailComponent {
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
    private dialog: MatDialog
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
        this.sanitizedImages = data.images.map(
          (img) => `${this.baseUrl}${img}`
        );
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load program details.';
        console.error(err);
        this.isLoading = false;
      },
    });
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

  participateInProgram(): void {
    const id = this.program?.id ?? 0;

    //userId trenutno prijavljeni korisnik
    this.programService.participateInProgram(41, id, 1).subscribe({
      next: (response) => {
        //this.snackBar.open('You have successfully participated in the program!', 'Close', { duration: 3000 });
      },
      error: (error) => {
        //this.snackBar.open('Failed to participate in the program. Please try again later.', 'Close', { duration: 3000 });
      },
    });
  }

  openPaymentModal() {
    let id = this.program?.id ?? 0;
    const dialogRef = this.dialog.open(PaymentMethodComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.programService
          .participateInProgram(31, id, result.paymentMethod)
          .subscribe({
            next: (response) => {
              if (response.program.location === 'Online') {
                window.open(response.program.youtubeLink, '_blank');
              } else {
                alert(
                  'You have successfully joined the program. Visit the location on the scheduled date.'
                );
              }
            },
            error: (err) => {
              alert('Failed to join the program. Please try again.');
            },
          });
      }
    });
  }
}
