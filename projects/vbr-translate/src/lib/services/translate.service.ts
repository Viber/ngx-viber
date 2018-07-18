import { EventEmitter, Inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  VBR_NAVIGATOR_TOKEN,
  VBR_TRANSLATE_ALLOWED_LANGUAGES,
  VBR_TRANSLATE_LANGUAGE_DETECTOR,
  VBR_TRANSLATE_DEFAULT_LANGUAGE,
  VBR_TRANSLATE_CANONICAL_CODES,
} from '../tokens';
import { first, map } from 'rxjs/operators';

export interface VbrLoaderEvent {
  language: string;
  eventType: 'started' | 'failed' | 'succeed';
  error?: any;
}

@Injectable()
export class VbrTranslateService {
  public loaderStatus: EventEmitter<VbrLoaderEvent> = new EventEmitter<VbrLoaderEvent>();

  constructor(
    private translate: TranslateService,
    // Array of the languages should be supported
    @Inject(VBR_TRANSLATE_ALLOWED_LANGUAGES) readonly allowedCodes,
    @Inject(VBR_TRANSLATE_DEFAULT_LANGUAGE) readonly defaultLanguage,
    @Inject(VBR_TRANSLATE_CANONICAL_CODES) readonly canonicalCode,
    @Inject(VBR_NAVIGATOR_TOKEN) private navigator,
    @Inject(VBR_TRANSLATE_LANGUAGE_DETECTOR) customLanguageDetector
  ) {
    // Canonize all provided language codes
    this.allowedCodes = this.allowedCodes.map(code => this.toCanonical(code));
    this.defaultLanguage = this.toCanonical(this.defaultLanguage);

    // Default language is not supported use first from allowed
    if (!this.isSupportedCode(this.defaultLanguage)) {
      this.defaultLanguage = this.allowedCodes[0];
    }

    // Set translation languages
    translate.addLangs(this.allowedCodes);

    // Set Default Language
    translate.setDefaultLang(this.defaultLanguage);

    // Detect and set current language
    // Will be executed only once
    customLanguageDetector.getLanguage()
      .pipe(
        first(),
        map((code: string) => {
          return this.isSupportedCode(code) ||
            this.detectBrowserLang() ||
            translate.getDefaultLang();
        })
      )
      .subscribe(code => this.setLanguage(code));
  }

  /**
   * Set new language by code
   *
   * @param code
   */
  public setLanguage(code: string) {
    code = this.toCanonical(code);
    if (!this.isSupportedCode(code)) {
      return;
    }

    // On successful language change/load, add to list of loaded Translations Languages
    this.loaderStatus.emit({language: code, eventType: 'started'});
    this.translate.use(code)
      .subscribe(e => {
        this.loaderStatus.emit({language: code, eventType: 'succeed'});
      }, error => {
        this.loaderStatus.emit({language: code, eventType: 'failed', error: error});
      });
  }

  /**
   * Check the language code is supported
   * return code if found
   *
   * @param code
   */
  public isSupportedCode(code: string): string | null {
    return -1 !== this.allowedCodes.indexOf(code) ? code : null;
  }

  /**
   * Canonize language code, "iw" will be converted to "he"
   *
   */
  private toCanonical(code) {
    return this.canonicalCode[code] || code;
  }

  /**
   * Detect browser language, try to find first supported language
   *
   * Rules are:
   * - Look for navigator.language first
   * - Look for a first met from navigator.languages
   */
  public detectBrowserLang(): string {
    if (typeof this.navigator === 'undefined') {
      return undefined;
    }

    return ('undefined' !== typeof this.navigator.language && this.findLanguageInLanguages([this.navigator.language])) ||
      ('undefined' !== typeof this.navigator.languages && this.findLanguageInLanguages(this.navigator.languages));
  }

  /**
   * Try to find first supported language
   * - First of all try to find language exact match.
   * - Try to find "culture" prefix from structures such as "en-AU", - "en"
   *
   * @TODO
   * in case languages array is something like this ["en-AU", "ru"]
   * and both "en" and "ru" are supported
   * first language to be found will be "ru"
   *
   * @param findLangs
   */
  private findLanguageInLanguages(findLangs: Array<string>): string | null {
    return findLangs.find(lang => !!this.isSupportedCode(lang))
      || findLangs
      // for constructions such as 'en-AU'
        .map(lang => lang.split('-')[0])
        .find(lang => !!this.isSupportedCode(lang));
  }
}
