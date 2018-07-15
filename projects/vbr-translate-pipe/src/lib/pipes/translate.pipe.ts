import {
  ChangeDetectorRef,
  Inject,
  OnDestroy,
  Optional,
  Pipe,
  PipeTransform
} from '@angular/core';

import {
  BehaviorSubject,
  combineLatest,
  Observable,
  of,
  Subject
} from 'rxjs';

import { filter, takeUntil } from 'rxjs/operators';

import {
  TranslatePipe,
  TranslateService
} from '@ngx-translate/core';

import { VBR_TRANSLATE_PREFIX } from '../tokens';

/**
 * Upgraded version of ngx-translate Translate Pipe
 *
 * Allows not to specify full path to translation string when provided with TRANSLATE_PREFIX in component.
 *
 * Pipe concat VBR_TRANSLATE_PREFIX with provided translation string and use the final string for translation.
 * Translation string should start with "." to benefit from such functionality,
 * otherwise it will be handled as regular string for translation.
 *
 * Example:
 *
 * Instead of
 * <h1>{{'content.screen.title' | translate}}</h1>
 * <p class="first">{{'content.screen.line' | translate}}</p>
 *
 * In your Component add to providers:
 *   providers: [
 *     {provide: VBR_TRANSLATE_PREFIX, useValue: 'content.screen'},
 *   ]
 *
 * So in component template next structure could be used
 * <h1>{{'.title' | vbrTranslate}}</h1>
 * <p class="first">{{'.line' | vbrTranslate}}</p>
 *
 */
@Pipe({
  name: 'vbrTranslate',
  pure: false
})
export class VbrTranslatePipe extends TranslatePipe implements PipeTransform, OnDestroy {
  private onDestroy$: Subject<any> = new Subject();
  protected lastParams$: Observable<Object> | Object;
  protected lastQuery$: BehaviorSubject<string> = new BehaviorSubject(undefined);

  constructor(translate: TranslateService,
              _ref: ChangeDetectorRef,
              @Optional() @Inject(VBR_TRANSLATE_PREFIX) private prefix: string
  ) {
    super(translate, _ref);
  }

  protected composeTranslationKey(value): string {
    if (!!this.prefix && !!value && value[0] === '.') {
      return this.prefix.concat(value);
    }

    return value;
  }

  transform(query: string, params$?: any): any {
    // In case params$ changed, or params$ is not set
    if (params$ !== this.lastParams$ || 'undefined' === typeof params$) {
      this.lastParams$ = params$;
      // Init destroy of old observable
      this.onDestroy$.next();

      // In case params$ is not observable, wrap it
      if (!(params$ instanceof Observable)) {
        params$ = of(params$);
      }

      // Create new Subscription to changes from both query and parameters changes.
      // It is responsible to emit new pairs of query and parameter to parent translate method.
      combineLatest(params$, this.lastQuery$)
        .pipe(
          takeUntil(this.onDestroy$),
          filter(([p, q]) => !!(q && q.length))
        )
        .subscribe(([p, q]) => {
          super.transform(this.composeTranslationKey(q), p);
        });
    }

    // Query string changed, emit the change
    if (query !== this.lastQuery$.value) {
      this.lastQuery$.next(query);
    }

    return this.value;
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.onDestroy$.next();
  }
}
