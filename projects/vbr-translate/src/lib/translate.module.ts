import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ModuleWithProviders, NgModule, Provider } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  VBR_TRANSLATE_ALLOWED_LANGUAGES,
  VBR_TRANSLATE_LANGUAGE_DETECTOR,
  VBR_TRANSLATE_DEFAULT_LANGUAGE,
  VBR_NAVIGATOR_TOKEN,
  VBR_TRANSLATE_CANONICAL_CODES,
  VBR_TRANSLATE_RTL_CODES
} from './tokens';

import {
  VbrCanonicalCodes,
  VbrDefaultLanguageCode,
  VbrRtlLanguageCodes,
  VbrSupportedLanguageCodes
} from './defaults';
import { VbrLanguageDetectorFake } from './classes/language-detector';
import { VbrTranslateService } from './services/translate.service';
import { VbrTranslatePipe } from './pipes/translate.pipe';

export interface VbrTranslateModuleConfig {
  allowedLanguages?: Array<string>;
  defaultLanguage?: string;
  languageDetector?: Provider;
  navigator?: Navigator;
  rtlLanguages?: Array<string>;
  canonicalCodes?: Array<string>;
}

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    TranslateModule,
  ],
  declarations: [
    VbrTranslatePipe,
  ],
  exports: [
    VbrTranslatePipe,
  ]
})

export class VbrTranslateModule {
  static forRoot(config: VbrTranslateModuleConfig = {}): ModuleWithProviders {
    return {
      ngModule: VbrTranslateModule,
      providers: [
        {provide: VBR_TRANSLATE_ALLOWED_LANGUAGES, useValue: config.allowedLanguages || VbrSupportedLanguageCodes},
        {provide: VBR_TRANSLATE_DEFAULT_LANGUAGE, useValue: config.defaultLanguage || VbrDefaultLanguageCode},
        {provide: VBR_TRANSLATE_CANONICAL_CODES, useValue: config.canonicalCodes || VbrCanonicalCodes},
        {provide: VBR_TRANSLATE_RTL_CODES, useValue: config.rtlLanguages || VbrRtlLanguageCodes},

        {provide: VBR_NAVIGATOR_TOKEN, useValue: config.navigator || navigator},
        config.languageDetector || {provide: VBR_TRANSLATE_LANGUAGE_DETECTOR, useClass: VbrLanguageDetectorFake},
        VbrTranslateService
      ]
    };
  }
}
