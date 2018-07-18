# VbrTranslateLoader

## @viberlab/translate-loader

## VbrTranslateLoader
This loader should be used within `TranslateModule` ([Write & use your own loader](https://github.com/ngx-translate/core#write--use-your-own-loader))

Loader able to load and merge translation from multiple translation loaders.
It implements [TranslateLoader](https://github.com/ngx-translate/http-loader), while each loader it uses implements `TranslateLoader` as well.

Loader can be configured to ignore failed loaders, they will be ignored and partial translations will be used.

Usage Example: 
```typescript
// Usage with TranslateHttpLoader from https://github.com/ngx-translate/http-loader
function createTranslateLoader(http: HttpClient) {

  return new VbrTranslateLoader(
    // Array of loaders to be used.
    [
      new TranslateHttpLoader(http, 'assets/@viberlab/translations/locale-', '.json'),
      new TranslateHttpLoader(http, 'assets/translations/locale-', '.json')
    ],
     true // Set to ignore failed loaders
  );
}

...
// In AppModule imports:

imports: [
  TranslateModule.forRoot({
    loader: {
      provide: TranslateLoader,
      useFactory: (createTranslateLoader),
      deps: [HttpClient]
    }
  }),
]

```
