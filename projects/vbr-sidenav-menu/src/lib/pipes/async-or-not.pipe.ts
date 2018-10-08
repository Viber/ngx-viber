import { ChangeDetectorRef, OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Pipe({
  name: 'asyncOrNot',
  pure: false,
})
export class AsyncOrNotPipe implements PipeTransform, OnDestroy {
  private onDestroy$: Subject<any> = new Subject();
  private lastValue$: Observable<any> = null;
  private lastValue: any;

  constructor(private _ref: ChangeDetectorRef) {

  }

  transform(value: Observable<any> | any, args?: any): any {
    // In case value is Observable, check that it new observable and subscribe to it
    if (!(value instanceof Observable)) {
      this.onDestroy$.next();
      this.lastValue = value;
      return this.lastValue;
    }

    // lastValue is same Observable - do nothing, return previous value
    if (value === this.lastValue$) {
      return this.lastValue;
    }

    // clean up previous subscription
    this.onDestroy$.next();

    this.lastValue$ = value;
    this.lastValue$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(v => {
        this.lastValue = v;
        this._ref.markForCheck();
      });
    return this.lastValue;
  }

  ngOnDestroy() {
    this.onDestroy$.next();
  }
}
