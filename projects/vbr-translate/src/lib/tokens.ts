import { InjectionToken } from '@angular/core';
// All supported languages with codes and names
import { VbrLanguage } from './interfaces';
import { VbrLanguageDetector } from './classes/language-detector';

export const VBR_TRANSLATE_ALLOWED_LANGUAGES = new InjectionToken<Array<string>>('VBR_TRANSLATE_ALLOWED_LANGUAGES');
export const VBR_TRANSLATE_DEFAULT_LANGUAGE = new InjectionToken<Array<string>>('VBR_TRANSLATE_DEFAULT_LANGUAGE');
export const VBR_TRANSLATE_LANGUAGE_DETECTOR = new InjectionToken<VbrLanguageDetector>('VBR_TRANSLATE_LANGUAGE_DETECTOR');

// Array of language codes to be handled as RTL
export const VBR_TRANSLATE_RTL_CODES = new InjectionToken<Array<string>>('VBR_TRANSLATE_RTL_CODES');

// Use this object to convert language codes to canonical form
// For example {'iw' : 'he'} will handle 'iw' as 'he'
export const VBR_TRANSLATE_CANONICAL_CODES = new InjectionToken<{ [code: string]: string }>('VBR_TRANSLATE_CANONICAL_CODES');

export const VBR_TRANSLATE_LANGUAGE_INFO = new InjectionToken<Array<VbrLanguage>>('VBR_TRANSLATE_LANGUAGE_INFO');

export const VBR_NAVIGATOR_TOKEN = new InjectionToken<Navigator>('Navigator');
