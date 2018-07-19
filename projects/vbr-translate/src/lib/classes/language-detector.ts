import { BehaviorSubject, Observable, of } from 'rxjs';
import { ParamMap, Router, RoutesRecognized } from '@angular/router';
import { filter, first, map } from 'rxjs/operators';
import { RouterEvent } from '@angular/router/src/events';

/**
 * Allows to add custom language for initial language detection
 * Should be used to override standard language detection flow
 * Use cases:
 *  * language passed from url parameter
 *  * language received from api response
 *
 */
export interface VbrLanguageDetector {
  getLanguage(): Observable<string>;
}

export class VbrLanguageDetectorFake implements VbrLanguageDetector {
  public getLanguage() {
    return of(null);
  }
}

/**
 * Example of language detector
 *
 * Can detect language according to defined parameter or query parameter.
 */
export class VbrLanguageDetectorCommon implements VbrLanguageDetector {
  private language$: BehaviorSubject<string | undefined> = new BehaviorSubject(undefined);

  constructor(router: Router, type: 'queryParam' | 'param', paramName: string) {
    // https://github.com/angular/angular/issues/12157#issuecomment-321525354
    router.events.pipe(
      // Make sure router init is done an
      // d we actually behold real one
      filter((event: RouterEvent) => !!event && event instanceof RoutesRecognized),
      map((event: RoutesRecognized) => {
        return type === 'queryParam' ? event.state.root.firstChild.queryParamMap : event.state.root.firstChild.paramMap;
      }),
      // Language been found from parameters or null
      map((params: ParamMap) => params.get(paramName) || null),
      // Need only first detected language, will not change it later
      first()
    ).subscribe(this.language$);
  }

  getLanguage(): Observable<string> {
    return this.language$
    // Filter vs undefined, because language$ is behavior subject initiated with undefined
      .pipe(filter(lang => undefined !== lang));
  }
}

/**
 * Shortcut to VbrLanguageDetectorCommon for Query Parameter
 */
export class VbrLanguageDetectorQueryParam extends VbrLanguageDetectorCommon {
  constructor(router: Router, paramName: string) {
    super(router, 'queryParam', paramName);
  }
}

/**
 * Shortcut to VbrLanguageDetectorCommon for Parameter
 */
export class VbrLanguageDetectorParam extends VbrLanguageDetectorCommon {
  constructor(router: Router, paramName: string) {
    super(router, 'param', paramName);
  }
}
