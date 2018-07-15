# VbrTranslateLoader

## @viberlab/translate-loader

## VbrTranslateLoader
This loader should be used within `TranslateModule` ([Write & use your own loader](https://github.com/ngx-translate/core#write--use-your-own-loader))

This loader can load translation from multiple data sources, each should implement [TranslateLoader](https://github.com/ngx-translate/http-loader) as well.

It also can will emmit to `VbrTranslateService.loadingEvent` on start end/end of the loading process.

In case some of the sources are failed, they will be ignored and partial translations will be used.

Usage Example: 
```typescript
// Usage with TranslateHttpLoader from https://github.com/ngx-translate/http-loader
function createTranslateLoader(http: HttpClient) {

  return new VbrTranslateLoader(
    [
      new TranslateHttpLoader(http, 'assets/@viberlab/translations/locale-', '.json'),
      new TranslateHttpLoader(http, 'assets/translations/locale-', '.json')
    ]
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
