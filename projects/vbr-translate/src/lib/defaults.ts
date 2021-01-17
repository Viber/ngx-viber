import { VbrLanguage } from './interfaces';

export const VbrDefaultLanguageCode = 'en';

export const VbrAllLanguages: Array<VbrLanguage> = [
  {lang: 'English', short: 'En', code: 'en'},
  {lang: 'Русский', short: 'Рус', code: 'ru'},
  {lang: 'Українська', short: 'Укр', code: 'uk'},
  {lang: 'Беларуская', short: 'Be', code: 'be'},
  {lang: 'العربية', short: 'ع', code: 'ar'},
  {lang: '日本語', short: '日', code: 'ja'},
  {lang: 'မြန်မာ (Unicode)', short: 'MY-MM', code: 'my-MM'},
  {lang: 'မြန်မာ (Zawgyi)', short: 'MY-ZW', code: 'my-ZW'},
  {lang: 'Srpski', short: 'SR', code: 'sr'},
  {lang: 'Ελληνικά', short: 'ΕΛ', code: 'el'},
  {lang: 'Tiếng Việt', short: 'Vi', code: 'vi'},
  {lang: 'Magyar', short: 'Hu', code: 'hu'},
  {lang: 'Hrvatski', short: 'Hr', code: 'hr'},
  {lang: 'Deutsch', short: 'DE', code: 'de'},
  {lang: 'Français', short: 'FR', code: 'fr'},
  {lang: 'Polski', short: 'PL', code: 'pl'},
  {lang: 'Italiano', short: 'It', code: 'it'},
  {lang: 'සිංහල', short: 'sin', code: 'si'},
  {lang: 'Slovenčina', short: 'SVK', code: 'sk'},
  {lang: 'Svenska', short: 'SE', code: 'sv'},
  {lang: 'বাংলা', short: 'বাং', code: 'bn'},
  {lang: 'Български', short: 'Бг', code: 'bg'},
  {lang: 'தமிழ்', short: 'tam', code: 'ta'},
  {lang: 'Türkçe', short: 'TR', code: 'tr'},
  {lang: 'नेपाली', short: 'नेपा', code: 'ne'},
  {lang: 'Norsk', short: 'NO', code: 'no'},
  {lang: 'Español', short: 'Es', code: 'es'},
  {lang: 'Català', short: 'CAT', code: 'ca'},
  {lang: 'Dansk ', short: 'DA', code: 'da'},
  {lang: 'Română', short: 'Ro', code: 'ro'},
  {lang: 'Português', short: 'pt-PT', code: 'pt-PT'},
  {lang: 'Português (Brasil)', short: 'pt-BR', code: 'pt-BR'},
  {lang: 'Indonesia', short: 'Id', code: 'id'},
  {lang: 'Nederlands', short: 'Nl', code: 'nl'},
  {lang: 'Čeština', short: 'CZ', code: 'cs'},
  {lang: 'Suomi', short: 'SU', code: 'fi'},
  {lang: 'עברית', short: 'עב', code: 'he'},
  {lang: 'Bahasa Melayu', short: 'Ms', code: 'ms'},
  {lang: 'فارسی', short: 'فا', code: 'fa'},
  {lang: 'ภาษาไทย', short: 'ไทย', code: 'th'},
  {lang: '简体中文', short: '简中', code: 'zh-CN'},
  {lang: '繁體中文', short: '繁中', code: 'zh-TW'},
  {lang: '한국어', short: 'ko', code: 'ko'},
  {lang: 'کوردی', short: 'Ku', code: 'ku'}
];

export const VbrSupportedLanguageCodes: Array<string> = [
  'en',
  'es',
  'fr',
  'hu',
  'ru',
  'th',
  'vi',
  'ar',
  'bg',
  'bn',
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
  'ne',
  'ms',
  'my-MM',
  'my-ZW',
  'no',
  'pl',
  'pt-PT',
  'pt-BR',
  'ro',
  'si',
  'sr',
  'sk',
  'sv',
  'ta',
  'tr',
  'uk',
  'be',
  'ku'
];

export const VbrRtlLanguageCodes: Array<string> = ['he', 'fa', 'ar'];
export const VbrCanonicalCodes = {'iw': 'he', 'nb': 'no'};
