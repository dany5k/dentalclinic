import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mypipe2'
})
export class Mypipe2Pipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    var fecha: string;
    fecha = value;
    var arrayFecha = fecha.split('-');
    // day month year time
    var fechaModificada = arrayFecha[0]+"/"+arrayFecha[1]+"/"+arrayFecha[2];

    return fechaModificada;
  }

}
