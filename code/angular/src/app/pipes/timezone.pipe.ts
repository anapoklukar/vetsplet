import { Pipe, PipeTransform } from '@angular/core';
import { TranslationService } from '../services/translation.service';

@Pipe({
  name: 'timezone',
  standalone: true
})
export class TimezonePipe implements PipeTransform {
  constructor(private translationService: TranslationService) {}
  transform(input: string): string {
    return "";
  }

}
