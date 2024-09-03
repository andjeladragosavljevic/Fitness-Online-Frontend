import { User } from './User';

export interface ActivityLog {
  id: number;
  duration: number;
  difficultyLevel: string;
  exerciseType: string;
  result: number;
  user: User;
  userId: number;
  createdAt: string;
}
