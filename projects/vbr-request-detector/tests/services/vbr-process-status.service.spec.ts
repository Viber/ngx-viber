import { RunHelpers } from 'rxjs/internal/testing/TestScheduler';
import { throttleTime } from 'rxjs/operators';
import { TestScheduler } from 'rxjs/testing';
import {
  splittedProcessCounter,
  VbrProcessStatusService,
} from '../../src/lib/serives/vbr-process-status.service';


describe('Vbr Process Counters', () => {

  const scheduler = new TestScheduler((actual, expected) => {
    // asserting the two objects are equal
    // e.g. using chai.
    expect(actual).toEqual(expected);
  });


  // This test will actually run *synchronously*
  xit('generate the stream correctly', () => {
    scheduler.run(helpers => {
      const {cold, expectObservable, expectSubscriptions} = helpers;
      const e1 = cold('-a--b--c---|');
      const subs = '^----------!';
      const expected = '-a-----c---|';

      expectObservable(e1.pipe(throttleTime(3, scheduler))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(subs);
    });
  });

  it('countSplittedProcesses pipe operator', () => {
    scheduler.run((helpers: RunHelpers) => {
      const {cold, expectObservable} = helpers;

      const emitterValues = {
        a: {delta: 1, name: 'first'}, // Add "first"
        b: {delta: -1, name: 'first'}, // Remove "first"
        c: {delta: 1, name: 'second'}, // Add "second"
        d: {delta: -1, name: 'second'}, // Remove "second"
      };
      const emitter = cold('-a--a-c-b-d-b-|', emitterValues);

      const expectedValues = {
        1: {count: 1, name: 'first'},
        2: {count: 2, name: 'first'},
        3: {count: 0, name: 'first'},

        4: {count: 1, name: 'second'},
        5: {count: 2, name: 'second'},
        6: {count: 0, name: 'second'},
      };
      const expected = '-1--2-4-1-6-3-|';

      expectObservable(
        emitter.pipe(splittedProcessCounter),
      ).toBe(expected, expectedValues);
    });
  });

  it('VbrProcessStatusService class', () => {
    const service = new VbrProcessStatusService();

  });

  // it('should map the values', () => {
  //   const a = cold('--1--2--|');
  //   const r = cold('--1--2--|');
  //
  //   expect(a).toBeObservable(r);
  // });
  //
  // it('will fetch nothing when Parameter is missing in url', () => {
  //   const detector = new VbrProcessStatusService();
  //   const values = {
  //     a: {action: 'start', name: 'First'},
  //     b: {action: 'stop', name: 'First'},
  //     c: {action: 'start', name: 'Second'},
  //     d: {action: 'stop', name: 'Second'},
  //     f: false,
  //     t: true,
  //   };
  //
  //   const acc: { [name: string]: VbrProcess } = {};
  //
  //   const emitterA = cold('-a-b-|', values).pipe(
  //     tap((action: { action: 'start' | 'stop', name: string }) => {
  //       console.log(action);
  //       if ('start' === action.action) {
  //         acc[action.name] = detector.start(action.name);
  //       } else {
  //         acc[action.name].stop();
  //       }
  //     }),
  //   );
  //
  //   const expectedA = cold('-f-t-', values);
  //
  //   const my = detector.isActive('First');
  //   my.subscribe(a => console.log('test', a));
  //
  //   // my.subscribe(a => console.log(a));
  //
  //   const hz = cold('-a-b-|', values);
  //
  //   expect(emitterA).toBeObservable(hz);
  //   // expect(my).toBeObservable(expectedA);
  // });
});
