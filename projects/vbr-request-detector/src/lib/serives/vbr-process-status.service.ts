import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  Subject,
} from 'rxjs';
import {
  delay,
  groupBy,
  map,
  mergeAll,
  mergeMap,
  scan,
  tap,
} from 'rxjs/operators';

export interface VbrProcessChange {
  delta: -1 | 1;
  name: string;
}

export function rxjsVbrProcess<T>(service: VbrProcessStatusService, name?: string) {
  const activity = service.start(name);

  return tap<T>(() => {
    },
    () => {
      activity.stop();
    },
    () => {
      activity.stop();
    });
}

export class VbrProcess {
  public readonly process$: Observable<VbrProcessChange>;
  private readonly stopper$: Subject<any> = new Subject();

  constructor(public readonly name: string) {

    this.process$ = new Observable<VbrProcessChange>((subscriber) => {
      subscriber.next({delta: 1, name: name});

      this.stopper$
        .subscribe(
          (next) => {
            // Should be no possible to get here, source should not emit anything.
          },
          (error) => {
            // Can only arrive here form timeout.
            // Lets complete the source
            subscriber.next({delta: -1, name: name});
            subscriber.complete();
          },
          () => {
            // We arrive here when source is complete from this function or external call
            subscriber.next({delta: -1, name: name});
            subscriber.complete();
          },
        );
    });
  }

  public stop() {
    this.stopper$.complete();
  }
}

@Injectable()
export class VbrProcessStatusService {
  public isActive = new Map<string, BehaviorSubject<boolean>>();
  private processes$: Subject<VbrProcess> = new Subject();

  constructor() {
    this.processes$
      .pipe(
        map(source => source.process$),
        mergeAll(),
        groupBy(process => process.name),
        mergeMap(group => {
          return group.pipe(
            map(process => process.delta),
            scan((acc, delta) => acc + delta, 0),
            tap(count => this.setStatus(group.key, !!count)),
          );
        }),

        map((value) => value > 0),
        delay(0),
      )
      .subscribe();
  }

  private setStatus(name: string, status: boolean) {
    this.getStatus(name).next(status);
  }

  public getStatus(name: string = 'default'): BehaviorSubject<boolean> {
    if (!this.isActive.has(name)) {
      this.createNewActivity(name);
    }

    return this.isActive.get(name);
  }

  private createNewActivity(name: string) {
    this.isActive.set(name, new BehaviorSubject(false));
  }

  public start(name: string = 'default') {

    const process = new VbrProcess(name);

    this.processes$.next(process);
    return process;
  }
}
