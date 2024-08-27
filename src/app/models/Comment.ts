import { User } from './User';

export interface Comment {
  id: number;

  content: string;

  createdAt: string;

  userId: number;

  user: User;

  fitnessProgramId: number;
}
