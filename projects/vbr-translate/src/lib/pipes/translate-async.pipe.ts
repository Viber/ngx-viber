import { OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { TranslatePipe, } from '@ngx-translate/core';
import { BehaviorSubject, combineLatest, Observable, of, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Pipe({
  name: 'vbrTranslateAsync',
  pure: false
})
export class VbrTranslateAsyncPipe extends TranslatePipe implements PipeTransform, OnDestroy {
  private onDestroy$: Subject<any> = new Subject();
  protected lastParams$: Observable<Object> | Object;
  protected lastQuery$: BehaviorSubject = new BehaviorSubject(undefined);

  transform(query: string, params$?: any): any {
    // In case params$ changed
    if (params$ !== this.lastParams$) {
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
        .pipe(takeUntil(this.onDestroy$))
        .subscribe(([p, q]) => super.transform(q, p));
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
