import { AfterViewChecked, AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { catchError, combineLatest, EMPTY, filter, Subscription, switchMap, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { NewsItemComponent } from '../../../dashboard/components/news-item/news-item.component';
import { NewsResponse } from '../../../dashboard/models/news-response-model';
import { NewsSelection } from '../../../dashboard/enums/news-selection.enum';
import { IApiNewsItem } from '../../../dashboard/interfaces/news-item.interface';
import { NewsNgRxService } from '../../services/news-ng-rx.service';
import { ScrollToDirective } from '../../directives/scroll-to.directive';

@Component({
  selector: 'app-dashboard-ng-rx',
  imports: [NewsItemComponent, CommonModule, FontAwesomeModule, ScrollToDirective],
  templateUrl: './dashboard-ng-rx.component.html',
  styleUrl: './dashboard-ng-rx.component.scss'
})
export class DashboardNgRxComponent implements OnInit, OnDestroy, AfterViewChecked {
  faSpinner = faSpinner;
  newsResponse: NewsResponse = new NewsResponse();
  @ViewChild('moreBtn') targetBtn!: ElementRef;
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;
  @ViewChild('scrollDirective') scrollDirective!: ScrollToDirective;
  constructor(private newsService: NewsNgRxService) {
    this.setupNewsListener();
  }
  ngAfterViewChecked(): void {
    // this.scrollToButtonInsideScrollableDiv();
    // this.scrollToButton1(); // works
    //this.scrollToButton(); // works
    // this.scrollToBottom();
    //this.scrollDirective.scrollTo(); // works
    //this.scrollTo();
    this.targetBtn.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  // ngAfterViewInit(): void {
  //   this.scrollToButton1();
  // }
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

  private scrollTo() {
    const element = document.getElementById('moreBtn');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }

  scrollToBottom() {
    // this.scrollContainer.nativeElement.scroll({
    //   top: this.scrollContainer.nativeElement.scrollHeight,
    //   behavior: 'smooth'
    // });
    const containerEl = this.scrollContainer.nativeElement;
    const buttonEl = this.targetBtn.nativeElement;
    const top = buttonEl.offsetTop - containerEl.offsetTop;
    containerEl.scroll({
      top: top,
      behavior: 'smooth',
      block: 'end'
    });
  }

  scrollToButton() {
    const button = document.querySelector('.more-button');
    if (button) {
      button.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }

  scrollToButtonInsideScrollableDiv() {
    const containerEl = this.scrollContainer.nativeElement;
    const buttonEl = this.targetBtn.nativeElement;

    const containerTop = containerEl.getBoundingClientRect().top;
    const buttonTop = buttonEl.getBoundingClientRect().top;
    const offset = buttonTop - containerTop + containerEl.scrollTop;

    containerEl.scrollTo({
      top: offset - 20, // adjust offset if needed
      behavior: 'smooth'
    });
  }

  scrollToButton1() {
    const button = document.querySelector('.more-button');
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const absoluteY = rect.top + window.scrollY;
    const yOffset = -20; // adjust if you have a header/footer
    const targetY = absoluteY + yOffset;

    window.scrollTo({ top: targetY, behavior: 'smooth' });
  }
}
