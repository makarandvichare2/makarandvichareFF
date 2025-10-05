import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY, forkJoin, Observable, shareReplay, switchMap } from 'rxjs';
import { NewsSelection } from '../../dashboard/enums/news-selection.enum';
import { Pagination } from '../../dashboard/models/pagination.model';
import { environment } from '../../common/enviornment/enviornment.dev';
import { ApiEndPoints } from '../../dashboard/constants/api-endpoints.const';
import { IApiNewsItem } from '../../dashboard/interfaces/news-item.interface';
import { select, Store } from '@ngrx/store';
import { AppState } from '../appstate';
import * as NewsItemActions from '../actions/news-item.actions';

@Injectable({
  providedIn: 'root'
})
export class NewsNgRxService {

  newsSelection$!: Observable<NewsSelection>;
  pagination$!: Observable<Pagination>;
  newItemIdsCache$!: Observable<number[]>;

  private pageInfo = new Pagination(0);
  constructor(private http: HttpClient, private store: Store<AppState>) {
    this.setupListeners();
  }

  private newsSelectionSubject = new BehaviorSubject<NewsSelection>(NewsSelection.None);
  private paginationSubject = new BehaviorSubject<Pagination>(this.pageInfo);
  private topNewsItemFromStore$!: Observable<number[]>;
  getNews(newsSelection: NewsSelection) {
    this.pageInfo.reset();
    this.paginationSubject.next(this.pageInfo);
    this.newsSelectionSubject.next(newsSelection);
  }

  loadMore() {
    this.pageInfo.currentPage = this.pageInfo.currentPage + 1;
    this.paginationSubject.next(this.pageInfo);
  }

  getTopStoriesData(): Observable<number[]> {
    return this.topNewsItemFromStore$;
    //return this.http.get<number[]>(environment.apiUrl + ApiEndPoints.TopStoriesEndPoint);
  }

  getNewStoriesData(): Observable<number[]> {
    return this.http.get<number[]>(environment.apiUrl + ApiEndPoints.NewStoriesEndPoint);
  }

  getNewsItemData(itemId: number): Observable<IApiNewsItem> {
    const finalEndPoint = ApiEndPoints.NewsItemEndPoint.replace("{0}", itemId.toString());
    return this.http.get<IApiNewsItem>(environment.apiUrl + finalEndPoint);
  }

  private setupListeners() {
    this.newsSelection$ = this.newsSelectionSubject.asObservable();
    this.pagination$ = this.paginationSubject.asObservable();

    this.newItemIdsCache$ = this.newsSelection$.pipe(
      switchMap((newsSelection: NewsSelection) => {
        if (newsSelection === NewsSelection.Top) {
          this.store.dispatch(NewsItemActions.loadNewsItemIds());
          return this.getTopStoriesData();
        }
        else if (newsSelection === NewsSelection.New) {
          return this.getNewStoriesData();
        }
        else {
          return EMPTY;
        }
      })
    );

    this.topNewsItemFromStore$ = this.store.pipe(select(state => state.entities.newsItemIds));
  }

  combinedNewsInfo(pageInfo: Pagination) {
    return this.newItemIdsCache$.pipe(
      switchMap((newsItemsIds: number[]) => {
        if (newsItemsIds.length === 0) {
          return EMPTY;
        }
        const pagedNewsItemIds = newsItemsIds.slice(
          pageInfo.currentPage * pageInfo.pageSize,
          (pageInfo.currentPage + 1) * pageInfo.pageSize);
        const newsDetail$ = pagedNewsItemIds.map(itemId => this.getNewsItemData(itemId)
        );
        return forkJoin(newsDetail$);
      }));
  }
}
