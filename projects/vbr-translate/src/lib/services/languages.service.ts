import { Inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  VBR_NAVIGATOR_TOKEN,
  VBR_ALLOWED_LANGUAGES,
  VBR_CUSTOM_LANGUAGE_DETECTOR,
  VBR_DEFAULT_LANGUAGE,
  VbrTranslateAllLanguages,
  VbrTranslateCanonicalCodes,
  VbrTranslateRtlLanguages
} from '../constants';
import { Observable, BehaviorSubject } from 'rxjs';
import { filter, map } from 'rxjs/operators';

export interface VbrLanguage {
  lang: string;
  code: string;
  short: string;
}

@Injectable()
export class VbrTranslateService {
  // Direction of the current language
  public dir: 'ltr' | 'rtl' = 'ltr';
  public loadingEvent: BehaviorSubject<boolean> = new BehaviorSubject(false);

  // All supported languages with codes and names
  public readonly languages: Array<VbrLanguage>;

  // RTL languages support for this:
  public readonly rtl: Array<string> = VbrTranslateRtlLanguages;

  private store: BehaviorSubject<VbrLanguage> = new BehaviorSubject(undefined);

  constructor(translate: TranslateService,
              @Inject(VBR_ALLOWED_LANGUAGES) allowedLanguages,
              @Inject(VBR_DEFAULT_LANGUAGE) defaultLanguage,
              @Inject(VBR_CUSTOM_LANGUAGE_DETECTOR) customLanguageDetector,
              @Inject(VBR_NAVIGATOR_TOKEN) private navigator) {

    // Init all supported languages
    this.languages = VbrTranslateAllLanguages
      .filter((language) => allowedLanguages.find(l => l === language.code));

    // Set translation languages
    translate.addLangs(this.languages.map(lang => lang.code));

    // Set Default Language
    translate.setDefaultLang(
      (this.getVbrLanguage(defaultLanguage) || this.languages[0]).code
    );

    customLanguageDetector.getLanguage()
    // @TODO Maybe should be emitted only once
    // So customLanguageDetector.getLanguage() will not be able to change language after
    // by emitting another value
    // Though such change could break functionality, keep this change for next version
    // .first()
      .pipe(
        map((code: string) => {
          return this.getVbrLanguage(code) ||
            this.getVbrLanguage(this.detectBrowserLang()) ||
            this.getVbrLanguage(translate.getDefaultLang());
        })
      )
      .subscribe((lang: VbrLanguage) => this.setLanguage(lang.code));

    this.languageChange
      .subscribe((language) => {
        // Set dir
        this.dir = (!!this.rtl.find((l) => l === language.code)) ? 'rtl' : 'ltr';

        // Set translation language
        translate.use(language.code);
      });
  }

  /**
   * Returns Observable that emits current language
   *
   */
  get languageChange(): Observable<VbrLanguage> {
    return this.store.pipe(filter(language => !!language));
  }

  /**
   * Set new language by code
   *
   * @param code
   */
  public setLanguage(code: string) {
    code = this.canonizeLanguageCode(code);
    const lang = this.getVbrLanguage(code);
    return !!lang && this.store.next(lang);
  }

  /**
   * Canonize language code, "iw" will be converted to "he"
   *
   */
  private canonizeLanguageCode(code) {
    return VbrTranslateCanonicalCodes[code] || code;
  }

  /**
   * Returns VbrLanguage if supported
   *
   */
  public getVbrLanguage(code: string): VbrLanguage {
    code = this.canonizeLanguageCode(code);
    return this.languages.find((l) => l.code === code);
  }

  /**
   * Detect browser language
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
   * first language to be found will be "ru"
   *
   * @param findLangs
   */
  private findLanguageInLanguages(findLangs: Array<string>): string | null {
    return findLangs.find(lang => !!this.getVbrLanguage(lang))
      || findLangs
      // for constructions such as 'en-AU'
        .map(lang => lang.split('-')[0])
        .find(lang => !!this.getVbrLanguage(lang));
  }
}
