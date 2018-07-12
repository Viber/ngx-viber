import { VbrTranslatePipe } from '../../src/lib/pipes/translate.pipe';
import { inject, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ChangeDetectorRef } from '@angular/core';
import { VBR_TRANSLATE_PREFIX } from '../../src/lib/tokens';
import { TestModuleMetadata } from '@angular/core/testing/src/test_bed';
import { of } from 'rxjs';

class FakeChangeDetectorRef extends ChangeDetectorRef {
  markForCheck(): void {
  }

  detach(): void {
  }

  detectChanges(): void {
  }

  checkNoChanges(): void {
  }

  reattach(): void {
  }
}

const KEY_WITH_PARAMS = 'start.params.with';
const KEY_WITHOUT_PARAMS = 'start.params.without';

const KEY_PREFIX = 'start.params';

const SHORT_KEY_WITH_PARAMS = '.with';
const SHORT_KEY_WITHOUT_PARAMS = '.without';


const vocabulary = {
  en: {
    'start': {
      'params': {
        'with': 'This is the test {{param}}',
        'without': 'This is the test'
      }
    },
  },
  ru: {
    'start': {
      'params': {
        'with': 'Это тест {{param}}',
        'without': 'Это тест'
      }
    },
  }
};


describe('VbrTranslatePipe', () => {

  // Prefix to be used with the pipe
  let prefix: string;

  // let translate: TranslateService;
  let pipe: VbrTranslatePipe;

  // let translate: TranslateService;

  beforeEach(() => {
    const model: TestModuleMetadata = {
      imports: [
        TranslateModule.forRoot()
      ],
      providers: [
        VbrTranslatePipe,
        {provide: ChangeDetectorRef, useClass: FakeChangeDetectorRef}
      ]
    };

    // Add VBR_TRANSLATE_PREFIX when prefix exists
    if (!!prefix) {
      model.providers.push({provide: VBR_TRANSLATE_PREFIX, useValue: prefix});
    }

    TestBed.configureTestingModule(model);

    const translate = TestBed.get(TranslateService);
    translate.setDefaultLang('en');
    translate.setTranslation('en', vocabulary.en);
  });

  beforeEach(inject([VbrTranslatePipe], p => pipe = p));


  describe('with VBR_TRANSLATE_PREFIX key prefix',
    () => {
      beforeAll(() => {
        prefix = KEY_PREFIX;
      });

      describe('able to translate regular keys', () => {
        it('translation template without params, no params provided', () => {
          expect(pipe.transform(KEY_WITHOUT_PARAMS)).toBe('This is the test');
        });
        it('translation template with params, no params provided', () => {
          expect(pipe.transform(KEY_WITH_PARAMS)).toBe('This is the test {{param}}');
        });
        it('translation template with params, with provided regular params', () => {
          expect(pipe.transform(KEY_WITH_PARAMS, {param: 'with param'})).toBe('This is the test with param');
        });
        it('translation template with params, with provided Observable params', () => {
          expect(pipe.transform(KEY_WITH_PARAMS, of({param: 'with Observable param'})))
            .toBe('This is the test with Observable param');
        });
      });

      describe('able to translate short keys', () => {
        it('translation template without params, no params provided', () => {
          expect(pipe.transform(SHORT_KEY_WITHOUT_PARAMS)).toBe('This is the test');
        });
        it('translation template with params, no params provided', () => {
          expect(pipe.transform(SHORT_KEY_WITH_PARAMS)).toBe('This is the test {{param}}');
        });
        it('translation template with params, with provided regular params', () => {
          expect(pipe.transform(SHORT_KEY_WITH_PARAMS, {param: 'with param'})).toBe('This is the test with param');
        });
        it('translation template with params, with provided Observable params', () => {
          expect(pipe.transform(SHORT_KEY_WITH_PARAMS, of({param: 'with Observable param'})))
            .toBe('This is the test with Observable param');
        });
      });
    }
  );

  describe('without VBR_TRANSLATE_PREFIX key prefix', () => {
    beforeAll(() => {
      prefix = undefined;
    });

    describe('able to translate regular keys', () => {
      it('translation template without params, no params provided', () => {
        expect(pipe.transform(KEY_WITHOUT_PARAMS))
          .toBe('This is the test');
      });
      it('translation template with params, no params provided', () => {
        expect(pipe.transform(KEY_WITH_PARAMS))
          .toBe('This is the test {{param}}');
      });
      it('translation template with params, with provided regular params', () => {
        expect(pipe.transform(KEY_WITH_PARAMS, {param: 'with param'}))
          .toBe('This is the test with param');
      });
      it('translation template with params, with provided Observable params', () => {
        expect(pipe.transform(KEY_WITH_PARAMS, of({param: 'with Observable param'})))
          .toBe('This is the test with Observable param');
      });
    });

    describe('unable to translate short keys', () => {
      it('translation template without params, no params provided', () => {
        expect(pipe.transform(SHORT_KEY_WITHOUT_PARAMS))
          .toBe(SHORT_KEY_WITHOUT_PARAMS);
      });
      it('translation template with params, no params provided', () => {
        expect(pipe.transform(SHORT_KEY_WITH_PARAMS))
          .toBe(SHORT_KEY_WITH_PARAMS);
      });
      it('translation template with params, with provided regular params', () => {
        expect(pipe.transform(SHORT_KEY_WITH_PARAMS, {param: 'with param'}))
          .toBe(SHORT_KEY_WITH_PARAMS);
      });
      it('translation template with params, with provided Observable params', () => {
        expect(pipe.transform(SHORT_KEY_WITH_PARAMS, of({param: 'with Observable param'})))
          .toBe(SHORT_KEY_WITH_PARAMS);
      });
    });
  });

  describe('Check changing params type affect translation correctly', () => {
    /**
     * Dimensions: key, params, language, default language
     *  key = 'start.params.with', 'start.params.without', undefined
     *  params = {param: 'with param'}, of({param: 'with Observable param'}), undefined
     *  language = 'en', 'ru'
     *
     *                | no params -1 | regular -2 | observable -3
     *  no params  -1 |              | 1 -> 2     | 1 -> 3
     *  regular    -2 | 2 -> 1       | 2 -> 2     | 2 -> 3
     *  observable -3 | 3 -> 1       | 3 -> 2     | 3 -> 3
     */

    const noParams = () => {
      expect(pipe.transform(KEY_WITH_PARAMS)).toBe('This is the test {{param}}');
    };

    const regularParams = (version: string = '') => {
      expect(pipe.transform(KEY_WITH_PARAMS, {param: 'with param' + version}))
        .toBe('This is the test with param' + version);
    };

    const observableParams = (version: string = '') => {
      expect(pipe.transform(KEY_WITH_PARAMS, of({param: 'with Observable param' + version})))
        .toBe('This is the test with Observable param' + version);
    };

    it('from no params to regular 1->2', () => {
      noParams();
      regularParams();
    });

    it('from no params to observable 1->3', () => {
      expect(pipe.transform(KEY_WITH_PARAMS)).toBe('This is the test {{param}}');
      observableParams();
    });

    it('from regular to no params 2->1', () => {
      regularParams();
      expect(pipe.transform(KEY_WITH_PARAMS)).toBe('This is the test {{param}}');
    });

    it('from regular to regular 2->2', () => {
      regularParams('1');
      regularParams('2');
    });

    it('from regular to observable 2->3', () => {
      regularParams();
      observableParams();
    });

    it('from observable to no params 3->1', () => {
      observableParams();
      noParams();
    });

    it('from observable to regular 3->2', () => {
      observableParams();
      regularParams();
    });

    it('from observable to observable 3->3', () => {
      observableParams('1');
      observableParams('2');
    });
  });

});
