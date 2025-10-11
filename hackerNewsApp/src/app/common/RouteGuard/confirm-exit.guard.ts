import { CanDeactivate } from '@angular/router';
import { ICanDeactivate } from '../interfaces/can-deactivate.interface';
import { map, Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../components/confirmation-dialog/confirmation-dialog.component';
import { Injectable } from '@angular/core';
import { NavigationStateService } from '../services/navigation-state.service';

@Injectable({ providedIn: 'root' })
export class ConfirmExitGuard implements CanDeactivate<ICanDeactivate> {
  constructor(private dialog: MatDialog, private navigationService: NavigationStateService) { }

  canDeactivate(component: ICanDeactivate): Observable<boolean> | boolean {
    // If component says it's safe to exit, allow directly
    if (component.canDeactivate()) {
      return true;
    }

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: { message: 'You have unsaved changes. Do you really want to leave?' },
    });

    return dialogRef.afterClosed().pipe(map(result => {
      if (!result) {
        this.navigationService.setPreviousAsActiveItem();
      }
      return !!result;
    }));
  }

}
