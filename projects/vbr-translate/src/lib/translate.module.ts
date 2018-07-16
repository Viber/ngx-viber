import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
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

export interface VbrTranslateModuleConfig {
  // array of all supported languages
  allowedLanguages?: Array<string>;
  // Object of canonical languages, used to transform non-canonical codes tho their canonical form
  // For example: if set {'iw' => 'he'}
  // "iw" will be handled as "he"
  canonicalCodes?: { [code: string]: string };
  // Default language
  defaultLanguage?: string;
  // Language Detector
  languageDetector?: Provider;
  // Navigator
  navigator?: Navigator;
  // Array of rtl languages
  rtlLanguages?: Array<string>;
}

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    TranslateModule,
  ],
  declarations: [],
  exports: []
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
