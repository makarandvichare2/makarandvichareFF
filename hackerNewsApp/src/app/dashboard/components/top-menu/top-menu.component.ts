import { Component } from '@angular/core';
import { NewsSelection } from '../../enums/news-selection.enum';
import { NewsService } from '../../services/news.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-top-menu',
  imports: [],
  templateUrl: './top-menu.component.html',
  styleUrl: './top-menu.component.scss'
})
export class TopMenuComponent {
  constructor(private newsService: NewsService, private router: Router) {

  }
  activeItem = 'NgRx Use';

  private setActiveItem(itemName: string): void {
    this.activeItem = itemName;
  }

  getTopNews(itemName: string, event: Event) {

    this.setActiveItem(itemName);
    event.preventDefault();
    this.router.navigate(['/dashboard']);
    this.newsService.getNews(NewsSelection.Top);
  }

  getLatestNews(itemName: string, event: Event) {

    this.setActiveItem(itemName);
    event.preventDefault();
    this.router.navigate(['/dashboard']);
    this.newsService.getNews(NewsSelection.New);
  }

  getCsv(itemName: string, event: Event) {

    this.setActiveItem(itemName);
    event.preventDefault();
    this.router.navigate(['/download']);
  }

  getNgrxNews(itemName: string, event: Event) {

    this.setActiveItem(itemName);
    event.preventDefault();
    this.router.navigate(['/dashboard-ngrx']);
    this.newsService.getNews(NewsSelection.Top);
  }

  getEmpty(itemName: string, event: Event) {

    this.setActiveItem(itemName);
    event.preventDefault();
    this.router.navigate(['/empty-page']);
  }
}
