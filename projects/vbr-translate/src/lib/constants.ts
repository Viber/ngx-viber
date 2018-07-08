import { InjectionToken } from '@angular/core';
// All supported languages with codes and names
import { VbrLanguage, VbrLanguageDetector } from './services';

// Used as prefix for VbrTranslatePipe
export const VBR_TRANSLATE_PREFIX: InjectionToken<string> = new InjectionToken('VBR_TRANSLATE_PREFIX');

export const VBR_ALLOWED_LANGUAGES = new InjectionToken<Array<string>>('VBR_ALLOWED_LANGUAGES');
export const VBR_DEFAULT_LANGUAGE = new InjectionToken<Array<string>>('VBR_DEFAULT_LANGUAGE');
export const VBR_CUSTOM_LANGUAGE_DETECTOR = new InjectionToken<VbrLanguageDetector>('VBR_CUSTOM_LANGUAGE_DETECTOR');
export const VBR_NAVIGATOR_TOKEN = new InjectionToken<Navigator>('Navigator');
export const VbrDefaultLanguage = 'en';

export const VbrTranslateAllLanguages: Array<VbrLanguage> = [
  {lang: 'English', short: 'En', code: 'en'},
  {lang: 'Español', short: 'Es', code: 'es'},
  {lang: 'Français', short: 'FR', code: 'fr'},
  {lang: 'Magyar', short: 'Hu', code: 'hu'},
  {lang: 'Русский', short: 'Рус', code: 'ru'},
  {lang: 'ภาษาไทย', short: 'ไทย', code: 'th'},
  {lang: 'Tiếng Việt', short: 'Vi', code: 'vi'},
  {lang: 'العربية', short: 'ع', code: 'ar'},
  {lang: 'Български', short: 'Бг', code: 'bg'},
  {lang: 'Català', short: 'CAT', code: 'ca'},
  {lang: '简体中文', short: '简中', code: 'zh-CN'},
  {lang: '繁體中文', short: '繁中', code: 'zh-TW'},
  {lang: 'Hrvatski', short: 'Hr', code: 'hr'},
  {lang: 'हिंदी', short: '', code: 'hi'},
  {lang: 'Čeština', short: 'CZ', code: 'cs'},
  {lang: 'Dansk ', short: '', code: 'da'},
  {lang: 'Nederlands', short: 'Nl', code: 'nl'},
  {lang: 'فارسی', short: 'فا', code: 'fa'},
  {lang: 'Suomi', short: 'SU', code: 'fi'},
  {lang: 'Deutsch', short: 'DE', code: 'de'},
  {lang: 'Ελληνικά', short: 'ΕΛ', code: 'el'},
  {lang: 'עברית', short: 'עב', code: 'he'},
  {lang: 'Indonesia', short: 'Id', code: 'id'},
  {lang: 'Italiano', short: 'It', code: 'it'},
  {lang: '日本語', short: '日', code: 'ja'},
  {lang: '한국어', short: 'ko', code: 'ko'},
  {lang: 'Bahasa Melayu', short: 'Ms', code: 'ms'},
  {lang: 'Norsk', short: 'NO', code: 'no'},
  {lang: 'Polski', short: 'PL', code: 'pl'},
  {lang: 'Português', short: 'pt-PT', code: 'pt-PT'},
  {lang: 'Português (Brasil)', short: 'pt-BR', code: 'pt-BR'},
  {lang: 'Română', short: 'Ro', code: 'ro'},
  {lang: 'Srpski', short: 'SR', code: 'sr'},
  {lang: 'Slovenčina', short: 'SVK', code: 'sk'},
  {lang: 'Svenska', short: 'SE', code: 'sv'},
  {lang: 'Türkçe', short: 'TR', code: 'tr'},
  {lang: 'Українська', short: 'Укр', code: 'uk'},
];

export const VbrSupportedLanguages: Array<string> = [
  'en',
  'es',
  'fr',
  'hi',
  'hu',
  'ru',
  'th',
  'vi',
  'ar',
  'bg',
  'ca',
  'zh-CN',
  'zh-TW',
  'hr',
  'cs',
  'da',
  'nl',
  'fa',
  'fi',
  'de',
  'el',
  'he',
  'id',
  'it',
  'ja',
  'ko',
  'ms',
  'no',
  'pl',
  'pt-PT',
  'pt-BR',
  'ro',
  'sr',
  'sk',
  'sv',
  'tr',
  'uk',
];

export const VbrTranslateRtlLanguages: Array<string> = ['he', 'fa', 'ar'];
export const VbrTranslateCanonicalCodes = {'iw': 'he', 'nb': 'no'};
