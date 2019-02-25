import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { delay, map, scan } from 'rxjs/operators';

@Injectable()
export class VbrRequestDetectorService {
  public active$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private counter$: BehaviorSubject<number> = new BehaviorSubject(0);

  constructor() {
    this.counter$
      .pipe(
        scan((acc, value) => acc + value, 0),
        map((value) => !!value),
        delay(0),
      )
      .subscribe(this.active$);
  }

  public activate() {
    this.counter$.next(1);
  }

  public deactivate() {
    this.counter$.next(-1);
  }

}
