import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavigationStateService {

  activeItem = 'NgRx Use';
  previousItem = '';

  setActiveItem(itemName: string): void {
    this.previousItem = this.activeItem;
    this.activeItem = itemName;
  }
  setPreviousAsActiveItem(): void {
    this.activeItem = this.previousItem;
  }
}
