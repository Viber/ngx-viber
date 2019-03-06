import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  MonoTypeOperatorFunction,
  Observable,
  Subject,
} from 'rxjs';
import {
  distinctUntilChanged,
  finalize,
  groupBy,
  map,
  mergeAll,
  mergeMap,
  pluck,
  scan,
} from 'rxjs/operators';

export interface VbrProcessDelta {
  delta: -1 | 1;
  name: string;
}

export interface VbrProcessCount {
  count: number;
  name: string;
}

export function rxjsVbrProcess<T>(service: VbrPulsarService, name?: string): MonoTypeOperatorFunction<T> {
  const activity = service.start(name);

  return finalize<T>(() => activity.stop());
}

export function splittedProcessCounter(source: Observable<VbrProcessDelta>) {
  return source.pipe(
    groupBy(process => process.name),
    mergeMap(group => {
      return group.pipe(
        pluck('delta'),
        scan((acc, delta) => acc + delta, 0),
        map(count => ({count: count, name: group.key} as VbrProcessCount)),
      );
    }),
  );
}

/**
 * Process class should be used with VbrPulsarService
 *
 */
export class VbrPulsarProcess {
  public readonly process$: Observable<VbrProcessDelta>;
  private readonly stopper$: Subject<any> = new Subject();

  constructor(public readonly name: string) {

    this.process$ = new Observable<VbrProcessDelta>((subscriber) => {
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

  /**
   * Mark the process as complete
   */
  public stop() {
    this.stopper$.complete();
  }
}

@Injectable()
export class VbrPulsarService {
  private processes$: Subject<Observable<VbrProcessDelta>> = new Subject();
  private defaultProcessName: string = 'default';
  private processStatus: BehaviorSubject<{ [processName: string]: number }> = new BehaviorSubject({});

  constructor() {
    this.processes$
      .pipe(
        mergeAll(),
        splittedProcessCounter,
      )
      .subscribe(processCount => {
        this.processStatus.next(
          {...this.processStatus.value, [processCount.name]: processCount.count},
        );
      });
  }

  /**
   * Observable emits number of active processes identified by optional parameter "name"
   * When not provided with parameter, default parameter name value used - 'default'
   *
   * When asked for never active activity, 0 will be emitted.
   *
   *
   * @param name
   */
  public count$(name: string = this.defaultProcessName): Observable<number> {
    return this.processStatus
      .pipe(
        map(status => status[name] || 0),
        distinctUntilChanged(),
      );
  }

  /**
   * Get number of active processes identified by optional parameter "name"
   * When not provided with parameter, default parameter name value used - 'default'
   *
   * When asked for never active activity, 0 will be emitted.
   *
   * @param name
   */
  public count(name: string = this.defaultProcessName): number {
    return this.processStatus.value[name] || 0;
  }

  /**
   * Observable emits activity identified by optional parameter "name" is active or not.
   * When not provided with parameter, default parameter name value used - 'default'
   *
   * @param name
   */
  public isActive$(name: string = this.defaultProcessName): Observable<boolean> {
    return this.count$()
      .pipe(
        map(count => !!count),
      );
  }

  /**
   * Check activity identified by optional parameter "name" is active or not.
   * When not provided with parameter, default parameter name value used - 'default'
   *
   * @param name
   */
  public isActive(name: string = this.defaultProcessName): boolean {
    return !!this.count(name);
  }

  /**
   * Return newly created process and adds it to service counters.
   *
   * process could be complete by calling .stop() method
   *
   *
   * @param name
   */
  public start(name: string = this.defaultProcessName): VbrPulsarProcess {
    const process = new VbrPulsarProcess(name);
    this.append(process.process$);
    return process;
  }

  /**
   * Append Observable of VbrProcessDelta to
   * @param process
   */
  public append(process: Observable<VbrProcessDelta>) {
    this.processes$.next(process);
  }
}
