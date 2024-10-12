import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'telNumberPipe',
  standalone: true
})
export class TelNumberPipePipe implements PipeTransform {

  transform(telNumber: string): string {
    if (!telNumber) {
      return '';
    }

    if (telNumber.startsWith('+')) {
      return telNumber;
    } else {
      return '+386' + telNumber.substring(1);
    }
  }

}
