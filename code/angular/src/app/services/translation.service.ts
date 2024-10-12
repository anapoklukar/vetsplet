import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import translations from "../../assets/translations.json"

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  private currentLang = 'slo';

  toggleLanguage() {
    this.currentLang = this.currentLang === 'slo' ? 'en' : 'slo';
  }

  toggleTimezone(){
    
  }
  private translations: any = translations;

  getTranslation(key: string): string {
    const lang = this.currentLang;
    return this.translations[lang] && this.translations[lang][key]
      ? this.translations[lang][key]
      : key;
  }
}
