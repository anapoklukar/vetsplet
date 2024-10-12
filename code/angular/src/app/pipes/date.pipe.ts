import { Pipe, PipeTransform } from '@angular/core';
import settings from '../../assets/settings.json'

@Pipe({
  name: 'customDate',
  standalone: true
})
export class DatePipe implements PipeTransform {
  transform(input: string): string {
    if (settings.dateFormat == 'mm') {
      const [datePart] = input.split(' ');
      const parts = datePart.split('-');
      if (parts.length === 3) {
        return `${parts[1]}-${parts[2]}-${parts[0]}` + ' ' + input.split(' ')[1]; 
      }
    }
    else {
      const [datePart] = input.split(' ');
      const parts = datePart.split('-');
      if (parts.length === 3) {
        return `${parts[2]}-${parts[1]}-${parts[0]}` + ' ' + input.split(' ')[1];
      }
    }
    return input;
  }

}
