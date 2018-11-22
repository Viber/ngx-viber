import { VbrBrowserLanguageDetector } from '../../src/lib/classes/browser-language-detector';

describe('Vbr Browser Language detectors', () => {
  /**
   * Rules
   *  Cases:
   *
   *  A: Using exact matched tag, even tag without region before
   *  user: ['en', 'he', 'en-GB', 'en-US']
   *  supported: ['en', 'he', 'en-GB', 'en-US']
   *  Result : 'en-GB'
   *
   *  B: No exact match for tag, using tag with language without region
   *  user: ['en', 'he', 'en-GB']
   *  supported: ['he', 'en']
   *  Result : 'en'
   *
   *  C: No exact match for language without region,
   *  using the tag with same language, but different region
   *  user: ['en', 'he']
   *  supported: ['he', 'en-GB', 'en-US']
   *  Result : 'en-GB'
   *
   *  D: D: No exact match for tag,
   *  using the tag with same language without region
   *  user: ['en-GB', 'he']
   *  supported: ['he', 'en']
   *  Result : 'en'
   *
   *  E: No exact match for tag,
   *  using the same tag with different region,
   *  when no language without region found.
   *  user: ['en-GB', 'he']
   *  supported: ['he', 'en-US']
   *  Result : 'en-US'
   *
   *
   *  F: No exact match for tag,
   *  using the same tag without region,
   *  even tag with different region is present and appears before.
   *
   *  user: ['en-GB', 'he']
   *  supported: ['he', 'en-US', 'en]
   *  Result : 'en'
   *
   *  G: Exact matched tag without region used,
   *  even tags with the same language appears before.
   *  user: ['en', 'he']
   *  supported: ['he', 'en-GB', 'en']
   *  Result : 'en'
   *
   */
  describe('Vbr Browser Language detectors', () => {

    it('A: Using exact matched tag, even tag without region before', (done: DoneFn) => {
      const navigator = generateNavigator(['en', 'he', 'en-GB', 'en-US']);
      const supported = ['en', 'he', 'en-GB', 'en-US'];
      const expected = 'en-GB';

      const detector = new VbrBrowserLanguageDetector(supported, navigator);
      detector.getLanguage()
        .subscribe((lang: string) => {
          expect(lang).toBe(expected);
          done();
        });
    });

    it('B: No exact match for tag, using tag with language without region', (done: DoneFn) => {
      const navigator = generateNavigator(['en', 'he', 'en-GB']);
      const supported = ['he', 'en'];
      const expected = 'en';

      const detector = new VbrBrowserLanguageDetector(supported, navigator);
      detector.getLanguage()
        .subscribe((lang: string) => {
          expect(lang).toBe(expected);
          done();
        });
    });

    it('C: No exact match for language without region, ' +
      'using the tag with same language, but different region', (done: DoneFn) => {
      const navigator = generateNavigator(['en', 'he']);
      const supported = ['he', 'en-GB', 'en-US'];
      const expected = 'en-GB';

      const detector = new VbrBrowserLanguageDetector(supported, navigator);
      detector.getLanguage()
        .subscribe((lang: string) => {
          expect(lang).toBe(expected);
          done();
        });
    });

    it('D: No exact match for tag, ' +
      'using the tag with same language without region', (done: DoneFn) => {
      const navigator = generateNavigator(['en-GB', 'he']);
      const supported = ['he', 'en'];
      const expected = 'en';

      const detector = new VbrBrowserLanguageDetector(supported, navigator);
      detector.getLanguage()
        .subscribe((lang: string) => {
          expect(lang).toBe(expected);
          done();
        });
    });

    it('E: No exact match for tag, ' +
      'using the same tag with different region, ' +
      'when no language without region found.', (done: DoneFn) => {
      const navigator = generateNavigator(['en-GB', 'he']);
      const supported = ['he', 'en-US'];
      const expected = 'en-US';

      const detector = new VbrBrowserLanguageDetector(supported, navigator);
      detector.getLanguage()
        .subscribe((lang: string) => {
          expect(lang).toBe(expected);
          done();
        });
    });

    it('F: No exact match for tag, ' +
      'using the same tag without region, ' +
      'even tag with different region is present and appears before', (done: DoneFn) => {
      const navigator = generateNavigator(['en-GB', 'he']);
      const supported = ['he', 'en-US', 'en'];
      const expected = 'en';

      const detector = new VbrBrowserLanguageDetector(supported, navigator);
      detector.getLanguage()
        .subscribe((lang: string) => {
          expect(lang).toBe(expected);
          done();
        });
    });

    it('G: Exact matched tag without region used, ' +
      'even tags with the same language appears before.', (done: DoneFn) => {
      const navigator = generateNavigator(['en', 'he']);
      const supported = ['he', 'en-GB', 'en'];
      const expected = 'en';

      const detector = new VbrBrowserLanguageDetector(supported, navigator);
      detector.getLanguage()
        .subscribe((lang: string) => {
          expect(lang).toBe(expected);
          done();
        });
    });

  });

  const generateNavigator = (languages: Array<string>, language?: string): Navigator => {
    return {
      language: language,
      languages: languages,
    } as Navigator;
  };

});
