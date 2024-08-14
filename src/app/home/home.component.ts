import { Component, OnInit } from '@angular/core';
import { RssFeedItem, RssFeedService } from '../services/rss-feed.service';
import { NgFor, NgIf } from '@angular/common';
import { AppMaterialModule } from '../app-material/app-material.module';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgFor, AppMaterialModule, NgIf, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  providers: [RssFeedService],
})
export class HomeComponent implements OnInit {
  feedItems: RssFeedItem[] = [];
  isDataLoaded = false;

  constructor(private rssFeedService: RssFeedService) {}

  ngOnInit(): void {
    this.rssFeedService.getFeed().subscribe((items) => {
      this.feedItems = items;
      this.isDataLoaded = true;
    });
  }
}
