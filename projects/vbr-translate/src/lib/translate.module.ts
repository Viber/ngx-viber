import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ModuleWithProviders, NgModule, Provider } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  VBR_ALLOWED_LANGUAGES,
  VBR_CUSTOM_LANGUAGE_DETECTOR,
  VBR_DEFAULT_LANGUAGE,
  VBR_NAVIGATOR_TOKEN,
  VbrDefaultLanguage,
  VbrSupportedLanguages
} from './constants';
import { VbrLanguageDetectorFake, VbrTranslateService } from './services';
import { VbrTranslatePipe, VbrTranslateAsyncPipe } from './pipes';

export interface VbrModuleConfig {
  allowedLanguages?: Array<string>;
  defaultLanguage?: string;
  languageDetector?: Provider;
  navigator?: Navigator;
}

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    TranslateModule,
  ],
  declarations: [
    VbrTranslateAsyncPipe,
    VbrTranslatePipe,
  ],
  exports: [
    VbrTranslateAsyncPipe,
    VbrTranslatePipe,
  ]
})

export class VbrTranslateModule {
  static forRoot(config: VbrModuleConfig = {}): ModuleWithProviders {
    return {
      ngModule: VbrTranslateModule,
      providers: [
        {provide: VBR_ALLOWED_LANGUAGES, useValue: config.allowedLanguages || VbrSupportedLanguages},
        {provide: VBR_DEFAULT_LANGUAGE, useValue: config.defaultLanguage || VbrDefaultLanguage},
        {provide: VBR_NAVIGATOR_TOKEN, useValue: config.navigator || navigator},
        config.languageDetector || {provide: VBR_CUSTOM_LANGUAGE_DETECTOR, useClass: VbrLanguageDetectorFake},
        VbrTranslateService
      ]
    };
  }
}
