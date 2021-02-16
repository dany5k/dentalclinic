import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appCustomtwo]'
})
export class CustomtwoDirective {

  constructor(private el:ElementRef) {
    el.nativeElement.style.backgroundColor = "#430281";
    el.nativeElement.style.color = "#fdd76b";
    el.nativeElement.innerText += "Made by Daniel K. ";
  }

}
