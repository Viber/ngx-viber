import { ChangeDetectorRef, Pipe, PipeTransform } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { TranslateService } from '@ngx-translate/core';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Pipe({name: 'vbrTranslateAsync'})
export class VbrTranslateAsyncPipe implements PipeTransform {
  private transPipe: TranslatePipe;

  constructor(private translate: TranslateService, _ref: ChangeDetectorRef) {
    this.transPipe = new TranslatePipe(translate, _ref);
  }

  transform(query: string, values$: Observable<{}>): any {
    return combineLatest(this.translate.onLangChange, values$)
      .pipe(
        map(([lang, values]) => this.transPipe.transform(query, values, Math.random()))
      );
  }
}
