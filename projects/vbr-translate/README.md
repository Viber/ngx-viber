# VbrTranslateModule Module

## @ngx-viber/translate

## Table of Contents
* [What is it for](#what-is-it-for)
* [Installation](#installation)

## What is it for
This module includes set of tools for easy

Services:
* VbrTranslateService
* VbrLanguageDetectorFromQueryParameter
* Custom Language Detector
* VbrLanguageDetector

Misc:
* Setup Supported Languages
* Translation for Supported languages
* RLT and LTR languages support
 
Pipes:
* [vbrTranslate](#vbrtranslate) - use partials in template names as well as supports observable parameters.

## Installation
```bash
npm install @viberlabs/translate --save
```

## Module
* Canonical language codes
* List of allowed Languages
* VbrTranslateLoader
* VbrLanguageDetector

In you module: 
```typescript
impors: [
  VbrTranslateModule.forRoot({
  allowedLanguages: ['en', 'he', 'ru'],
  canonicalCodes: {iw => 'he'},
  defaultLanguage: 'en',
  rtlLanguages: ['he']
  })
]
```

Module configuration
Module configuration should implement interface `VbrTranslateModuleConfig`

```typescript
 interface VbrTranslateModuleConfig {
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
```

## Language detectors
In some cases you want to be able to detect default application language
We are providing you with the base preset of such language detectors.
In case there is no language detector provided we will try to detect supported language from navigate.languages or use default language.

Preset Language Detectors:
* `VbrLanguageDetectorFake` - used as fallback in case no Language detector provided
* `VbrLanguageDetectorQueryParam` - set language from query param
* `VbrLanguageDetectorParam` - set language from param

Example of preset Language detector usage:
```typescript
function languageDetector(router: Router): VbrLanguageDetector {
  // look for a "lang" query param and use it as default language
  return new VbrLanguageDetectorQueryParam(router, 'lang');
}

...
// In AppModule imports:

imports: [
  VbrTranslateModule.root({
  languageDetector: {
      provide: VBR_CUSTOM_LANGUAGE_DETECTOR,
      useFactory: (languageDetector),
      deps: [Router]
    } 
  })
]


```

Also you can create your own language detector by implementing `VbrLanguageDetector`:
```typescript
class CustomLanguageDetector implements VbrLanguageDetector {
  public getLanguage(): Observable<string> {
    return of('en');
  }
}
```
At next step language detector should be provided to VbrTranslateModule 
```typescript
function languageDetector(): VbrLanguageDetector {
  return new CustomLanguageDetector();
}

...
// In AppModule imports:

imports: [
  VbrTranslateModule.root({
  languageDetector: {
      provide: VBR_CUSTOM_LANGUAGE_DETECTOR,
      useFactory: (languageDetector)
    } 
  })
]


```



## VbrTranslateService
Injection Tokens:
* `VBR_TRANSLATE_ALLOWED_LANGUAGES`
* `VBR_TRANSLATE_DEFAULT_LANGUAGE`
* `VBR_TRANSLATE_CANONICAL_CODES`
* `VBR_NAVIGATOR_TOKEN`
* `VBR_TRANSLATE_LANGUAGE_DETECTOR`

## VbrLanguageInfoService
* RTL and LTR languages support

Injection Tokens:
* `VBR_TRANSLATE_RTL_CODES`
* `VBR_TRANSLATE_LANGUAGE_INFO`


## vbrTranslate
Upgraded version of ngx-translate Translate Pipe

* [Short Keys](#short-keys) - allows not to specify full path to translation string when provided with `VBR_TRANSLATE_PREFIX` in component services.
* [Observable as pipe parameter](#observable-as-pipe-parameter).

### Short Keys
Pipe concat `VBR_TRANSLATE_PREFIX` with translation key string and use it as final translation string.
Translation key should start with "." to benefit from such functionality,
otherwise it will be handled as regular key.

Example:

Instead of:
```angular2html
<h1>{{'content.screen.title' | translate}}</h1>
<p>{{'content.screen.line' | translate}}</p>
```

In your Component add to providers:
```typescript
  providers: [
    {provide: VBR_TRANSLATE_PREFIX, useValue: 'content.screen'},
  ]
```

So in component template short keys could be used
```angular2html
<h1>{{'.title' | vbrTranslate}}</h1>
<p class="first">{{'.line' | vbrTranslate}}</p>
```

### Observable as pipe parameter

Example:
```typescript
// translation file
...
{
  'greetings': 'Hi {name}, welcome home!'
}
...

// component
public userName = of({name: 'Peter'});

```

In the template
```angular2html
<h1>{{'greetings' | vbrTranslate:userName}}</h1>
```
