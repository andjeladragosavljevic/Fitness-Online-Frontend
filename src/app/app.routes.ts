import { Routes } from '@angular/router';
import { ExercisesListComponent } from './exercises-list/exercises-list.component';
import { HomeComponent } from './home/home.component';
import { ProgramListComponent } from './program-list/program-list.component';
import { MyProgramsComponent } from './my-programs/my-programs.component';
import { ProgramDetailComponent } from './program-detail/program-detail.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Home page' },
  {
    path: 'exercises',
    component: ExercisesListComponent,
    title: 'Exercises page',
  },
  {
    path: 'programs',
    component: ProgramListComponent,
    title: 'Fitness Programs',
  },
  {
    path: 'my-programs',
    component: MyProgramsComponent,
    title: 'My Programs',
  },
  {
    path: 'programs/:id',
    component: ProgramDetailComponent,
    title: 'Program Details',
  },
];
