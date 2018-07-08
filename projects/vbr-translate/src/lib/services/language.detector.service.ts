import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

/**
 * Allows to add custom language for initial language detection
 * Should be used to override standard language detection flow
 * Use cases:
 *  * language passed from url parameter
 *  * language received from api response
 *
 * Language detection flow:
 *  * Try VbrLanguageDetector
 *  * Try TranslateService.getBrowserCultureLang()
 *  * Try TranslateService.getBrowserLang()
 *  * Try VbrTranslateService.getDefaultLang()
 */
export interface VbrLanguageDetector {
  getLanguage(): Observable<string>;
}

@Injectable()
export class VbrLanguageDetectorFake implements VbrLanguageDetector {
  getLanguage() {
    return of(null);
  }
}
