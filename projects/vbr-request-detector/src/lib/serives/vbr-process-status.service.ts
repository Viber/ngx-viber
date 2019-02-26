import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { delay, map, mergeAll, scan, timeout } from 'rxjs/operators';

class VbrProcess {
  public readonly process$: Observable<-1 | 1>;
  private readonly stopper$: Subject<any> = new Subject();

  constructor(ttl: number) {
    this.process$ = new Observable<-1 | 1>((subscriber) => {
      subscriber.next(1);

      this.stopper$
        .pipe(timeout(ttl))
        .subscribe(
          (nex) => {
            // Should be no possible to get here, source should not emit anything.
          },
          (error) => {
            // Can only arrive here form timeout.
            // Lets complete the source
            subscriber.next(-1);
            subscriber.complete();
          },
          () => {
            // We arrive here when source is complete from this function or external call
            subscriber.next(-1);
            subscriber.complete();
          }
        );
    });
  }

  public stop() {
    this.stopper$.complete();
  }
}

@Injectable()
export class VbrProcessStatusService {
  public active$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private processes$: Subject<VbrProcess> = new Subject();

  constructor() {
    this.processes$
      .pipe(
        map(source => source.process$),
        mergeAll(),
        scan((acc, value) => acc + value, 0),
        map((value) => value > 0),
        delay(0),
      )
      .subscribe(this.active$);
  }

  public start(ttl: number = 15000) {

    const process = new VbrProcess(ttl);

    this.processes$.next(process);
    return process;
  }
}
