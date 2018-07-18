import { TranslateLoader } from '@ngx-translate/core';
import { Observable, of, throwError } from 'rxjs';
import { VbrTranslateLoader } from '../src/lib/translate-loader';
import { async as _async } from 'rxjs/internal/scheduler/async';

class StaticLoader extends TranslateLoader {
  constructor(private translation) {
    super();
  }

  getTranslation(lang: string): Observable<any> {
    return of(this.translation, _async);
  }
}

class FailedLoader extends TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    return throwError('failed to load');
  }
}

const firstLoader = new StaticLoader({'first': 'some data'});
const secondLoader = new StaticLoader({'second': 'something else'});

/**
 * Test cases
 *
 * 1. able to load translations with multiple loaders
 * 2. When one of the loaders failed, second translation should be received anyway.
 * 3. Able to emmit start fetching to VbrTranslate service when provided
 * 4. Able to emmit end fetching to VbrTranslate service when provided
 */

describe('VbrTranslateLoader', () => {

  describe('With silencer OFF', () => {
    it('Successful load successful loaders :).', (done: DoneFn) => {
      const loader = new VbrTranslateLoader([firstLoader, secondLoader], false);

      loader.getTranslation('en')
        .subscribe((translations) => {
          expect(translations).toEqual({'second': 'something else', 'first': 'some data'});
          done();
        }, error => {
          done.fail('Expected not to receive error');
        });
    });

    it('When one of the loaders failed, all failed.', (done: DoneFn) => {
      const loader = new VbrTranslateLoader([firstLoader, new FailedLoader(), secondLoader], false);

      loader.getTranslation('en')
        .subscribe(
          (translations) => {
            done.fail('Expected to receive error');
          },
          error => {
            expect(error).toBe('failed to load');
            done();
          });
    });

  });

  describe('With silencer ON', () => {
    it('Successful load successful loaders :).', (done: DoneFn) => {
      const loader = new VbrTranslateLoader([firstLoader, secondLoader], true);

      loader.getTranslation('en')
        .subscribe((translations) => {
          expect(translations).toEqual({'second': 'something else', 'first': 'some data'});
          done();
        }, error => {
          done.fail('Expected not to receive error');
        });
    });

    it('When one of the loaders failed, rest should be received anyway.', (done: DoneFn) => {
      const loader = new VbrTranslateLoader([firstLoader, new FailedLoader(), secondLoader], true);

      loader.getTranslation('en')
        .subscribe((translations) => {
          expect(translations).toEqual({'second': 'something else', 'first': 'some data'});
          done();
        }, error => {
          done.fail('Expected not to receive error');
        });
    });
  });
});
