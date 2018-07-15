import { Observable, of, zip } from 'rxjs';
import { TranslateLoader } from '@ngx-translate/core';
import { Optional } from '@angular/core';
import { VbrTranslateService } from '@viberlab/translate';
import { catchError, map, tap } from 'rxjs/operators';

export class VbrTranslateLoader implements TranslateLoader {
  protected loaders: Array<TranslateLoader> = [];

  constructor(additionalLoaders: Array<TranslateLoader>, @Optional() private  vbrTranslateService?: VbrTranslateService) {
    additionalLoaders.map(loader => this.addLoader(loader));
  }

  public getTranslation(lang: string): Observable<any> {
    if (this.vbrTranslateService) {
      // Started loading
      this.vbrTranslateService.loadingEvent.next(true);
    }
    const observables: Array<Observable<any>> = this.loaders.map(loader => {
      return loader.getTranslation(lang)
        .pipe(
          catchError(e => {
            return of({});
          })
        )
        ;
    });

    return zip(...observables)
      .pipe(
        map(loaders => Object.assign({}, ...loaders)),
        tap(() => {
          if (this.vbrTranslateService) {
            this.vbrTranslateService.loadingEvent.next(false);
          }
        })
      );
  }

  public addLoader(loader: TranslateLoader) {
    this.loaders.push(loader);
  }
}

