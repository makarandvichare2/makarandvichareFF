import { Component, OnDestroy, OnInit } from '@angular/core';
import { catchError, combineLatest, EMPTY, filter, Subscription, switchMap, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { NewsItemComponent } from '../../../dashboard/components/news-item/news-item.component';
import { NewsResponse } from '../../../dashboard/models/news-response-model';
import { NewsSelection } from '../../../dashboard/enums/news-selection.enum';
import { IApiNewsItem } from '../../../dashboard/interfaces/news-item.interface';
import { NewsNgRxService } from '../../services/news-ng-rx.service';

@Component({
  selector: 'app-dashboard-ng-rx',
  imports: [NewsItemComponent, CommonModule, FontAwesomeModule],
  templateUrl: './dashboard-ng-rx.component.html',
  styleUrl: './dashboard-ng-rx.component.scss'
})
export class DashboardNgRxComponent implements OnInit, OnDestroy {
  faSpinner = faSpinner;
  newsResponse: NewsResponse = new NewsResponse();
  constructor(private newsService: NewsNgRxService) {
    this.setupNewsListener();
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  ngOnInit(): void {
    this.newsService.getNews(NewsSelection.Top);
  }

  loadMore() {
    this.newsService.loadMore();
  }

  private subscription!: Subscription;
  private setupNewsListener() {
    this.subscription = combineLatest(
      [this.newsService.newsSelection$,
      this.newsService.pagination$])
      .pipe(
        filter(([newsSelection, _]) => newsSelection != NewsSelection.None),
        tap(([_, pageInfo]) => {
          this.newsResponse.loading = true;
          this.newsResponse.pageInfo = pageInfo;
          if (this.newsResponse.pageInfo.currentPage == 0) {
            this.newsResponse.data = [];
          }
        }),
        switchMap(([_, pageInfo]) => {
          return this.newsService.combinedNewsInfo(pageInfo);
        }),
        catchError(error => {
          this.newsResponse.error = error;
          this.newsResponse.loading = false;
          return EMPTY;
        }),
        // map((newsItems: IApiNewsItem[]) => {
        //   return newsItems.map((newsItem) => {
        //     const { kids, ...requiredColumn } = newsItem;
        //     return requiredColumn;
        //   });
        // })
      ).subscribe(
        (newsItems: IApiNewsItem[]) => {
          this.newsResponse.data.push(...newsItems);
          this.newsResponse.loading = false;
          this.newsResponse.error = null;
        })
  }
}
