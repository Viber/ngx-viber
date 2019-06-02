import {
  Inject,
  Injectable,
} from '@angular/core';
import {
  LangChangeEvent,
  TranslateService,
} from '@ngx-translate/core';
import { VbrLanguage } from '../interfaces';
import {
  VBR_TRANSLATE_ALLOWED_LANGUAGES,
  VBR_TRANSLATE_LANGUAGES_INFO,
  VBR_TRANSLATE_RTL_CODES,
} from '../tokens';

@Injectable()
export class VbrLanguageInfoService {
  // Direction of the current language
  public dir: 'ltr' | 'rtl' = 'ltr';

  public readonly languages: Array<VbrLanguage>;

  constructor(
    private translate: TranslateService,
    // RTL languages support for this
    @Inject(VBR_TRANSLATE_RTL_CODES) public readonly rtlCodes: Array<string>,
    @Inject(VBR_TRANSLATE_LANGUAGES_INFO) languagesInfo: Array<VbrLanguage>,
    @Inject(VBR_TRANSLATE_ALLOWED_LANGUAGES) public readonly allowedLanguages: Array<string>,
  ) {
    // Remove Language info not in allowedLanguages list
    this.languages = languagesInfo.filter(lang => -1 !== allowedLanguages.indexOf(lang.code));
    this.translate.onLangChange
      .subscribe((code: LangChangeEvent) => {
        // Set dir
        this.dir = -1 === this.rtlCodes.indexOf(code.lang) ? 'ltr' : 'rtl';
      });
  }

  /**
   * Returns VbrLanguage
   */
  public getLanguage(code: string): VbrLanguage {
    return this.languages.find((l) => l.code === code);
  }
}
