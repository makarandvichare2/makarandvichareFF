import { NewsDashBoardComponent } from './../../../dashboard/components/news-dashboard/news-dashboard.component';
import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IWorkerInput } from '../../interfaces/worker-input.interface';
import { Helpers } from '../../services/helper';
/// <reference lib="webworker" />
@Component({
  selector: 'app-download-csv',
  imports: [CommonModule, NewsDashBoardComponent],
  templateUrl: './download-csv.component.html',
  styleUrl: './download-csv.component.scss'
})
export class DownloadCsvComponent {

  result = '';
  @ViewChild(NewsDashBoardComponent) dashboardComponent!: NewsDashBoardComponent;

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

    } else {
      // Fallback: Web Workers are not supported
      this.result = 'Web Workers not supported.';
    }
  }
}
