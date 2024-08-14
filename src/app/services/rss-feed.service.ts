import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { XMLParser } from 'fast-xml-parser';
import { isDataSource } from '@angular/cdk/collections';
@Injectable({
  providedIn: 'root',
})
export class RssFeedService {
  private url = 'http://feeds.feedburner.com/AceFitFacts';
  constructor(private http: HttpClient) {}

  getFeed(): Observable<RssFeedItem[]> {
    return this.http.get(this.url, { responseType: 'text' }).pipe(
      map((response) => {
        const parser = new XMLParser();
        const jsonObj = parser.parse(response);

        let feedItems: RssFeedItem[] = [];
        const items = jsonObj?.rss?.channel?.item;

        if (items && Array.isArray(items)) {
          items.forEach((item: any) => {
            feedItems.push({
              title: item.title,
              link: item.link,
              description: item.description,
            });
          });
        } else {
          console.error('No items found in RSS feed');
        }
        return feedItems;
      })
    );
  }
}

export interface RssFeedItem {
  title: string;
  link: string;
  description: string;
}
