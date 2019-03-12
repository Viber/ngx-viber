import {
  Inject,
  Injectable
} from '@angular/core';
import {
  VBR_TRANSLATE_LANGUAGES_INFO,
  VBR_TRANSLATE_RTL_CODES
} from '../tokens';
import { VbrLanguage } from '../interfaces';
import {
  LangChangeEvent,
  TranslateService
} from '@ngx-translate/core';

@Injectable()
export class VbrLanguageInfoService {
  // Direction of the current language
  public dir: 'ltr' | 'rtl' = 'ltr';

  constructor(
    private translate: TranslateService,
    // RTL languages support for this
    @Inject(VBR_TRANSLATE_RTL_CODES) public readonly rtlCodes: Array<string>,
    @Inject(VBR_TRANSLATE_LANGUAGES_INFO) public readonly languages
  ) {
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
