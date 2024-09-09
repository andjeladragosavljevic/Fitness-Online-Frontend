import { Component } from '@angular/core';
import { AppMaterialModule } from '../app-material/app-material.module';
import { SubscriptionService } from '../services/subscription.service';
import { CategoryService } from '../services/category.service';
import { Category } from '../models/Category';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-subscription',
  standalone: true,
  imports: [AppMaterialModule, CommonModule],
  templateUrl: './subscription.component.html',
  styleUrl: './subscription.component.css',
})
export class SubscriptionComponent {
  categories: any[] = [];

  userId = Number(localStorage.getItem('userId'));
  token = localStorage.getItem('token');

  userEmail: string = 'andjadragos@icloud.com';

  constructor(
    private subscriptionService: SubscriptionService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories(): void {
    this.categoryService.getCategories().subscribe((data: Category[]) => {
      this.categories = data;
    });
  }

  subscribeToCategory(category: Category): void {
    const subscriptionRequest = {
      userId: this.userId,
      categoryId: category.id,
      email: this.userEmail,
    };

    this.subscriptionService
      .subscribeToCategory(subscriptionRequest)
      .subscribe(() => {
        alert(`Successfully subscribed to ${category.name}`);
      });
  }
}
