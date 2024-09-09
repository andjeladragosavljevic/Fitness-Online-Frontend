import { Routes } from '@angular/router';
import { ExercisesListComponent } from './exercises-list/exercises-list.component';
import { HomeComponent } from './home/home.component';
import { ProgramListComponent } from './program-list/program-list.component';
import { MyProgramsComponent } from './my-programs/my-programs.component';
import { ProgramDetailComponent } from './program-detail/program-detail.component';
import { MyProgramDetailComponent } from './my-program-detail/my-program-detail.component';
import { AddProgramComponent } from './add-program/add-program.component';
import { ParticipationsComponent } from './participations/participations.component';
import { ActivityLogComponent } from './activity-log/activity-log.component';
import { UserForCommunicationComponent } from './user-for-communication/user-for-communication.component';
import { SubscriptionComponent } from './subscription/subscription.component';
import { RegistrationComponent } from './registration/registration.component';
import { ActivateAccountComponent } from './activate-account/activate-account.component';
import { ProfileComponent } from './profile/profile.component';
import { LoginComponent } from './login/login.component';
import { AuthGuardService } from './services/auth-guard.service';
import { ChatComponent } from './chat/chat.component';

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
    canActivate: [AuthGuardService],
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
    canActivate: [AuthGuardService],
  },
  {
    path: 'add-program',
    component: AddProgramComponent,
    title: 'New Program',
    canActivate: [AuthGuardService],
  },
  {
    path: 'edit-program',
    component: AddProgramComponent,
    title: 'Edit Program',
    canActivate: [AuthGuardService],
  },
  {
    path: 'participations',
    component: ParticipationsComponent,
    title: 'Participations',
    canActivate: [AuthGuardService],
  },
  {
    path: 'activity-log',
    component: ActivityLogComponent,
    title: 'Activity Log',
    canActivate: [AuthGuardService],
  },
  {
    path: 'chat',
    component: UserForCommunicationComponent,
    title: 'Chat',
    canActivate: [AuthGuardService],
  },
  {
    path: 'chat/:userId',
    component: ChatComponent,
    title: 'Inbox',
    canActivate: [AuthGuardService],
  },
  {
    path: 'subscriptions',
    component: SubscriptionComponent,
    title: 'Subscriptions',
    canActivate: [AuthGuardService],
  },
  {
    path: 'registration',
    component: RegistrationComponent,
    title: 'Registration',
  },
  {
    path: 'activate-account',
    component: ActivateAccountComponent,
    title: 'Account Activation',
  },
  {
    path: 'profile',
    component: ProfileComponent,
    title: 'Profile',
    canActivate: [AuthGuardService],
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login',
  },
];
