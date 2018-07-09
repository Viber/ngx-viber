import { Inject, Injectable } from '@angular/core';
import {
  VBR_TRANSLATE_LANGUAGE_INFO,
  VBR_TRANSLATE_RTL_CODES
} from '../tokens';
import { VbrLanguage } from '../interfaces';
import { VbrTranslateService } from './translate.service';

@Injectable()
export class VbrLanguageInfoService {
  // Direction of the current language
  public dir: 'ltr' | 'rtl' = 'ltr';

  // RTL languages support for this:
  @Inject(VBR_TRANSLATE_RTL_CODES)
  public readonly rtlCodes: Array<string>;

  @Inject(VBR_TRANSLATE_LANGUAGE_INFO)
  public readonly languages;

  constructor(private translate: VbrTranslateService) {
    this.translate.languageChange
      .subscribe((code) => {
        // Set dir
        this.dir = -1 === this.rtlCodes.indexOf(code) ? 'ltr' : 'rtl';
      });
  }

  /**
   * Returns VbrLanguage
   */
  public getLanguage(code: string): VbrLanguage {
    return this.languages.find((l) => l.code === code);
  }
}
