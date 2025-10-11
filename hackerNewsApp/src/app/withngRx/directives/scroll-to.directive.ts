import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appScrollTo]',
  exportAs: 'appScrollTo'
})
export class ScrollToDirective {
  constructor(private el: ElementRef) {

  }
  scrollTo() {
    this.el.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }
}
