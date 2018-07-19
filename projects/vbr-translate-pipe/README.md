## vbrTranslate
Extended version of [ngx-translate/core](https://github.com/ngx-translate/core) `TranslatePipe`

Features:
* [Short Keys](#short-keys) - allows not to specify full path to translation string when provided with `VBR_TRANSLATE_PREFIX` in component providers.
* [Observable as pipe parameter](#observable-as-pipe-parameter).

### Short Keys
Pipe concat `VBR_TRANSLATE_PREFIX` with translation key string and use it as final translation string.
Translation key should start with "." to benefit from such functionality, otherwise it will be handled as regular key.

Example:

Instead of:
```angular2html
<h1>{{'content.screen.title' | translate}}</h1>
<p>{{'content.screen.line' | translate}}</p>
```

In your component add to providers:
```typescript
  providers: [
    {provide: VBR_TRANSLATE_PREFIX, useValue: 'content.screen'},
  ]
```

Now in component template short keys could be used:
```angular2html
<h1>{{'.title' | vbrTranslate}}</h1>
<p class="first">{{'.line' | vbrTranslate}}</p>
```

### Observable as pipe parameter
Use Observable as pipe parameter.

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

In your template

BEFORE
```angular2html
<h1>{{'greetings' | translate:(userName | async)}}</h1>
```

AFTER
```angular2html
<h1>{{'greetings' | vbrTranslate:userName}}</h1>
```
