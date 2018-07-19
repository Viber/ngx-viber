import {
  convertToParamMap,
  Params,
  Router, RouterEvent, RouterStateSnapshot,
  RoutesRecognized
} from '@angular/router';
import { EventEmitter } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  VbrLanguageDetectorCommon, VbrLanguageDetectorFake,
  VbrLanguageDetectorParam,
  VbrLanguageDetectorQueryParam
} from '../../src/lib/classes/language-detector';

class ActivatedRouteSnapshotStub {
  // Use a ReplaySubject to share previous values with subscribers
  // and pump new values into the `paramMap` observable
  private paramMap = convertToParamMap({});
  private queryParamMap = convertToParamMap({});

  constructor(initialParams: Params, initialQueryParams: Params) {
    this.setParamMap(initialParams);
    this.setQueryParamMap(initialQueryParams);
  }

  public setParamMap(params?: Params) {
    this.paramMap = convertToParamMap(params);
  }

  public setQueryParamMap(params?: Params) {
    this.queryParamMap = (convertToParamMap(params));
  }
}

class RouterStateSnapshotStub {
  public root = {};

  constructor(activatedSnapshot) {
    this.root = {
      firstChild: activatedSnapshot
    };
  }

}

export class RouterStub {

  public events: EventEmitter<RouterEvent> = new EventEmitter();

  public emitEvent(event: RouterEvent) {
    this.events.emit(event);
  }
}


describe('Vbr Language detectors', () => {

  const routerStub = new RouterStub();
  let router;

  beforeAll(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: Router, useValue: routerStub}
      ]
    });
    router = TestBed.get(Router);

  });


  const routerStateSnapshot = new RouterStateSnapshotStub(
    new ActivatedRouteSnapshotStub({lang: 'ru'}, {lang: 'en'})
  ) as RouterStateSnapshot;


  it('VbrLanguageDetectorFake always emit null', (done: DoneFn) => {
    const detector = new VbrLanguageDetectorFake();
    detector.getLanguage()
      .subscribe((lang: string) => {
        expect(lang).toBeNull();
        done();
      });
  });

  it('able to fetch language from queryParam', (done: DoneFn) => {
    const detector = new VbrLanguageDetectorCommon(router, 'queryParam', 'lang');
    const shortDetector = new VbrLanguageDetectorQueryParam(router, 'lang');

    shortDetector.getLanguage()
      .subscribe((lang: string) => {
        expect(lang).toBe('en');
        done();
      });

    detector.getLanguage()
      .subscribe((lang: string) => {
        expect(lang).toBe('en');
        done();
      });

    // Emit RoutesRecognized with
    router.emitEvent(new RoutesRecognized(1, '', '', routerStateSnapshot));

  });

  it('will fetch nothing when queryParameter is missing in url', (done: DoneFn) => {
    const detector = new VbrLanguageDetectorCommon(router, 'queryParam', 'language');
    const shortDetector = new VbrLanguageDetectorQueryParam(router, 'language');

    shortDetector.getLanguage()
      .subscribe((lang: string) => {
        expect(lang).toBeNull();
        done();
      });

    detector.getLanguage()
      .subscribe((lang: string) => {
        expect(lang).toBeNull();
        done();
      });

    // Emit RoutesRecognized with
    router.emitEvent(new RoutesRecognized(1, '', '', routerStateSnapshot));

  });

  it('able to fetch language from Param', (done: DoneFn) => {
    const detector = new VbrLanguageDetectorCommon(router, 'param', 'lang');
    const shortDetector = new VbrLanguageDetectorParam(router, 'lang');

    shortDetector.getLanguage()
      .subscribe((lang: string) => {
        expect(lang).toBe('ru');
        done();
      });

    detector.getLanguage()
      .subscribe((lang: string) => {
        expect(lang).toBe('ru');
        done();
      });

    // Emit RoutesRecognized with
    router.emitEvent(new RoutesRecognized(1, '', '', routerStateSnapshot));
  });

  it('will fetch nothing when Parameter is missing in url', (done: DoneFn) => {
    const detector = new VbrLanguageDetectorCommon(router, 'param', 'language');
    const shortDetector = new VbrLanguageDetectorParam(router, 'language');

    shortDetector.getLanguage()
      .subscribe((lang: string) => {
        expect(lang).toBeNull();
        done();
      });

    detector.getLanguage()
      .subscribe((lang: string) => {
        expect(lang).toBeNull();
        done();
      });

    // Emit RoutesRecognized with
    router.emitEvent(new RoutesRecognized(1, '', '', routerStateSnapshot));

  });
});
