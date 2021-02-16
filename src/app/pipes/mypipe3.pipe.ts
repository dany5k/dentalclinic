import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mypipe3'
})
export class Mypipe3Pipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    
    if(value == "activo") {
      return 'activo'; // It changes class name
    } else {
      return 'terminado';
    }

  }

}
