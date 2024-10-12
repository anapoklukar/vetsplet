import { Pipe, PipeTransform } from '@angular/core';
import { TranslationService } from '../services/translation.service';

@Pipe({
  name: 'translatePipe',
  standalone: true,
  pure: false,
})
export class TranslatePipePipe implements PipeTransform {
  constructor(private translationService: TranslationService) {}

  transform(value: string): string {
    return this.translationService.getTranslation(value);
  }
}
