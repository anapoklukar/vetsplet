import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'iSOToReadable',
  standalone: true
})
export class ISOToReadablePipe implements PipeTransform {
  transform(text: string) {
    let withSeconds = text.replace('T', ' ').replace('Z', ' ')
    let timeArr = withSeconds.split(':')
    let time = timeArr[0] + ':' + timeArr[1];
    return time;
  }

}
