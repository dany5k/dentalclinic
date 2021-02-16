import { Directive, ElementRef } from '@angular/core';


@Directive({
  selector: '[appCustomone]'
})
export class CustomoneDirective {

  constructor(private el:ElementRef) {
    el.nativeElement.style.color = "#035886";
  }

}
