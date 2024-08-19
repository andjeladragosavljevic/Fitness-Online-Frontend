import { Category } from './Category';

export interface Program {
  id: number;
  name: string;
  description: string;
  category: Category;
  price: number;
  difficultyLevel: string;
  startDate: string;
  endDate: string;
  location: string; // npr. 'online', 'teretana', 'park'
  images: string[]; // Niz URL-ova slika
  instructor: Instructor;
  contact: string;
  specificAttributes: SpecificAttribute[];
}

export interface SpecificAttribute {
  name: string;
  value: string;
}

export interface Instructor {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}
