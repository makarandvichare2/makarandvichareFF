import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard-ngrx' },
  {
    path: 'download', loadComponent: () => import('./web-worker-feature/components/download-csv/download-csv.component')
      .then(m => m.DownloadCsvComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/components/news-dashboard/news-dashboard.component')
      .then(m => m.NewsDashBoardComponent)
  },
  {
    path: 'dashboard-ngrx',
    loadComponent: () => import('./withngRx/components/dashboard-ng-rx/dashboard-ng-rx.component')
      .then(m => m.DashboardNgRxComponent)
  }
];
