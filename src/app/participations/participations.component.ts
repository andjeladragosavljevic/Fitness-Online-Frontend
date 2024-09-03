import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { ParticipationService } from '../services/participation.service';
import { Participation } from '../models/Participation';
import { AppMaterialModule } from '../app-material/app-material.module';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-participations',
  standalone: true,
  imports: [DatePipe, NgIf, NgFor, AppMaterialModule, RouterModule],
  templateUrl: './participations.component.html',
  styleUrl: './participations.component.css',
})
export class ParticipationsComponent {
  participations: Participation[] = [];
  error: string | null = null;
  current = true;

  constructor(private participationService: ParticipationService) {}

  ngOnInit(): void {
    this.loadParticipations();
  }

  loadParticipations(): void {
    const userId = 31;
    this.participationService
      .getUserParticipations(userId, this.current)
      .subscribe({
        next: (data) => (this.participations = data),
        error: (err) => (this.error = 'Failed to load participations'),
      });
  }

  toggleParticipationView(): void {
    this.current = !this.current;
    this.loadParticipations();
  }
}
