import { Component, OnInit } from '@angular/core';
import { Program } from '../models/Program';
import { ActivatedRoute } from '@angular/router';
import { ProgramService } from '../services/program.service';
import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { SlickCarouselModule } from 'ngx-slick-carousel';

@Component({
  selector: 'app-my-program-detail',
  standalone: true,
  imports: [NgIf, NgFor, SlickCarouselModule, CurrencyPipe],
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
    slidesToShow: 4,
    slidesToScroll: 1,
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: true,
  };

  constructor(
    private route: ActivatedRoute,
    private programService: ProgramService
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
        this.sanitizedImages = data.images.map(
          (img) => `${this.baseUrl}${img}`
        );
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load program details.';
        console.log(err);
        this.isLoading = false;
      },
    });
  }
}
