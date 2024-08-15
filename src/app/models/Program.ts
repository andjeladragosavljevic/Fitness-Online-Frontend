import { Category } from './Category';

export interface Program {
  id: number;
  name: string;
  description: string;
  category: Category;
  price: number;
  difficulty: string;
  duration: number;
  location: string; // npr. 'online', 'teretana', 'park'
  images: string[]; // Niz URL-ova slika
  instructor: Instructor;
  contact: string;
}

export interface SpecifičniAtributi {
  name: string;
  category: Category;
}

export interface Instructor {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}
