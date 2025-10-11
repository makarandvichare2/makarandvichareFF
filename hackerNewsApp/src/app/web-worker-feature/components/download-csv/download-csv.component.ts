import { NewsDashBoardComponent } from './../../../dashboard/components/news-dashboard/news-dashboard.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IWorkerInput } from '../../interfaces/worker-input.interface';
import { Helpers } from '../../services/helper';
import { filter, Observable } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PopupComponent } from '../../../common/components/popup/popup.component';
import { ConfirmationDialogComponent } from '../../../common/components/confirmation-dialog/confirmation-dialog.component';
import { ICanDeactivate } from '../../../common/interfaces/can-deactivate.interface';
/// <reference lib="webworker" />
@Component({
  selector: 'app-download-csv',
  imports: [CommonModule, NewsDashBoardComponent],
  templateUrl: './download-csv.component.html',
  styleUrl: './download-csv.component.scss'
})
export class DownloadCsvComponent implements OnInit, ICanDeactivate {
  constructor(private router: Router, private dialog: MatDialog) { }

  result = '';
  saved = false;
  @ViewChild(NewsDashBoardComponent) dashboardComponent!: NewsDashBoardComponent;
  ngOnInit() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        // this.openModalOnRouteChange();
      });
  }
  download() {
    if (typeof Worker !== 'undefined') {
      this.result = 'Calculating in background...';

      // 1. Create a new Worker instance
      // The CLI handles the path resolution using new URL(...)
      const worker = new Worker(new URL('../../services/mak-worker.worker', import.meta.url));

      // 2. Listen for messages from the worker
      worker.onmessage = ({ data }) => {
        this.result = data;
        const fileName = 'csv' + new Date().toString();
        console.log('Calculation complete, worker terminated.');
        Helpers.downloadFile(data, fileName);
        worker.terminate(); // Terminate to free up resources
      };

      // 3. Post the message (data) to the worker to start the task
      const headers: Record<string, string> = {
        "by": "By",
        "descendants": "Comment Counts",
        "id": "Id",
        "score": "Score",
        "time": "Time",
        "title": "Title",
        "type": "Type",
        "url": "Url"
      };

      const data = {
        csvData: this.dashboardComponent.newsResponse.data,
        headers: headers
      } as IWorkerInput;
      worker.postMessage(data);
      this.saved = true;

    } else {
      // Fallback: Web Workers are not supported
      this.result = 'Web Workers not supported.';
    }
  }
  openModalOnRouteChange() {
    this.dialog.open(PopupComponent, {
      width: '400px',
      disableClose: true
    });
  }

  openConfirm() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: { message: 'Are you sure you want to delete this item?' },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('User confirmed!');
        // Place your deletion logic here
      } else {
        console.log('User cancelled!');
      }
    });
  }

  canDeactivate(): boolean | Observable<boolean> {
    return this.saved;
  }
}
