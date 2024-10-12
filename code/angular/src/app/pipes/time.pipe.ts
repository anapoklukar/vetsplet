import { Pipe, PipeTransform } from '@angular/core';
import settings from '../../assets/settings.json'

@Pipe({
  name: 'time',
  standalone: true
})
export class TimePipe implements PipeTransform {
  transform(input: string): string {
    if (settings.timeFormat == '12') {
      let [datePart, timePart] = input.split(' ');
      let [hours, minutes] = timePart.split(':').map(part => parseInt(part, 10));
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      return datePart + ' ' + `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    }
    return input;
  }
  
}
