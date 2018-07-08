# VbrTranslate

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
* [vbrTranslate](#vbrTranslate) - use partials in template names.
* vbrTranslateAsync - template with parameter, when parameter could change.

## Installation
```bash
npm install @viberlabs/translate --save
```

### vbrTranslate
Upgraded version of ngx-translate Translate Pipe

Allows not to specify full path to translation string when provided with VBR_TRANSLATE_PREFIX in component.

Pipe concat VBR_TRANSLATE_PREFIX with provided translation string and use the final string for translation.
Translation string should start with "." to benefit from such functionality,
otherwise it will be handled as regular string for translation.

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

So in component template next structure could be used
```angular2html
<h1>{{'.title' | vbrTranslate}}</h1>
<p class="first">{{'.line' | vbrTranslate}}</p>
```

