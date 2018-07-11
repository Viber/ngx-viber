import { VbrTranslatePipe } from '../../src/lib/pipes/translate.pipe';
import { inject, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ChangeDetectorRef } from '@angular/core';
import { VBR_TRANSLATE_PREFIX } from '../../src/lib/tokens';
import { TestModuleMetadata } from '@angular/core/testing/src/test_bed';

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


describe('VbrTranslatePipe', () => {

  // Prefix to be used with the pipe
  let prefix: string;

  // let translate: TranslateService;
  let pipe: VbrTranslatePipe;

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
    translate.setTranslation('en', {start: {end: 'TRANSLATION FOUND'}});
  });

  beforeEach(inject([VbrTranslatePipe], p => pipe = p));


  describe('with VBR_TRANSLATE_PREFIX',
    () => {
      beforeAll(() => {
        prefix = 'start';
      });

      it('translates full translate path "start.end" to "TRANSLATION FOUND"', () => {
        expect(pipe.transform('start.end')).toBe('TRANSLATION FOUND');
      });

      it('translates partial translation pattern ".end" to "TRANSLATION FOUND"', () => {
        expect(pipe.transform('.end')).toBe('TRANSLATION FOUND');
      });
    }
  );

  describe('no VBR_TRANSLATE_PREFIX', () => {
    beforeAll(() => {
      prefix = undefined;
    });

    it('able to translate "start.end" to "TRANSLATION FOUND"', () => {
      expect(pipe.transform('start.end')).toBe('TRANSLATION FOUND');
    });

    it('unable to find translation for ".end"', () => {
      expect(pipe.transform('.end')).toBe('.end');
    });
  });
});
