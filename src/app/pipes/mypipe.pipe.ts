import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mypipe'
})
export class MypipePipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    
    if(value !== 'NA') {
      return value;
    } else {
      return "***************";
    }

  }

}
