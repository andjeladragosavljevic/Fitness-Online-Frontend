import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { ParticipationService } from '../services/participation.service';
import { Participation } from '../models/Participation';

@Component({
  selector: 'app-participations',
  standalone: true,
  imports: [DatePipe, NgIf, NgFor],
  templateUrl: './participations.component.html',
  styleUrl: './participations.component.css',
})
export class ParticipationsComponent {
  participations: Participation[] = [];
  error: string | null = null;

  constructor(private participationService: ParticipationService) {}

  ngOnInit(): void {
    const userId = 41;
    this.participationService.getUserParticipations(userId).subscribe({
      next: (data) => (this.participations = data),
      error: (err) => (this.error = 'Failed to load participations'),
    });
  }
}
