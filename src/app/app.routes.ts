import { Routes } from '@angular/router';
import { ExercisesListComponent } from './exercises-list/exercises-list.component';
import { HomeComponent } from './home/home.component';
import { ProgramListComponent } from './program-list/program-list.component';
import { MyProgramsComponent } from './my-programs/my-programs.component';
import { ProgramDetailComponent } from './program-detail/program-detail.component';
import { MyProgramDetailComponent } from './my-program-detail/my-program-detail.component';
import { AddProgramComponent } from './add-program/add-program.component';
import { ParticipationsComponent } from './participations/participations.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Home page',
  },
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
    title: 'Program Detail',
  },
  {
    path: 'my-programs/:id',
    component: MyProgramDetailComponent,
    title: 'My Program Detail',
  },
  {
    path: 'add-program',
    component: AddProgramComponent,
    title: 'New Program',
  },
  {
    path: 'edit-program',
    component: AddProgramComponent,
    title: 'Edit Program',
  },
  { path: 'participations', component: ParticipationsComponent },
];
