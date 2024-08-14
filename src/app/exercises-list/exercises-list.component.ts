import { Component, OnInit } from '@angular/core';
import {
  Exercise,
  ExerciseListService,
} from '../services/exercise-list.service';
import { NgFor, NgStyle, NgIf } from '@angular/common';
import { AppMaterialModule } from '../app-material/app-material.module';

@Component({
  selector: 'app-exercises-list',
  standalone: true,
  imports: [NgFor, NgStyle, NgIf, AppMaterialModule],
  templateUrl: './exercises-list.component.html',
  styleUrl: './exercises-list.component.css',
})
export class ExercisesListComponent implements OnInit {
  exercises: Exercise[] = [];
  isDataLoaded = false;

  constructor(private exerciseListService: ExerciseListService) {}

  ngOnInit(): void {
    this.exerciseListService.getExercises().subscribe((items) => {
      this.exercises = items;
      this.isDataLoaded = true;
    });
  }

  getColor(difficulty: string): string {
    switch (difficulty) {
      case 'beginner':
        return 'green';
      case 'intermediate':
        return 'orange';
      case 'expert':
        return 'red';
      default:
        return 'black';
    }
  }
}
