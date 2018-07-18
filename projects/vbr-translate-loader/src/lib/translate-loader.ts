import { Observable, of, throwError, zip } from 'rxjs';
import { TranslateLoader } from '@ngx-translate/core';
import { catchError, map, tap } from 'rxjs/operators';

export class VbrTranslateLoader implements TranslateLoader {
  protected loaders: Array<TranslateLoader> = [];

  constructor(
    additionalLoaders: Array<TranslateLoader>,
    protected silentExceptions: boolean = false,
  ) {
    additionalLoaders.map(loader => this.addLoader(loader));
  }

  public getTranslation(lang: string): Observable<any> {
    const observables: Array<Observable<any>> = this.loaders.map(loader => {
      return loader.getTranslation(lang)
        .pipe(
          catchError(e => {
            return this.silentExceptions ? of({}) : throwError(e);
          })
        );
    });

    return zip(...observables)
      .pipe(
        map(loaders => Object.assign({}, ...loaders))
      );
  }

  public addLoader(loader: TranslateLoader) {
    this.loaders.push(loader);
  }
}

