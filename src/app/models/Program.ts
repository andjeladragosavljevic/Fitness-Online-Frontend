export interface Program {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  difficulty: string;
  duration: number;
  location: string; // npr. 'online', 'teretana', 'park'
  imageUrl: string;
  instructor: {
    name: string;
    contact: string;
  };
  specificAttributes?: any;
}
