import { VbrLanguageDetector } from './language-detector';
import { Observable, of } from 'rxjs';

/**
 * Class used to find best match of user prefered languages set in navigate.languages
 *
 * More about logic behind this class: https://gist.github.com/zagushka/9fc3092b529d0a6c226e0e87846665a9
 */
export class VbrBrowserLanguageDetector implements VbrLanguageDetector {
  readonly detectedLanguage: string;

  /**
   * @param supportedLanguages - array of language tags application support
   * @param navigator - reference to document.navigator
   */
  constructor(supportedLanguages: Array<string>, private navigator: Navigator) {
    // merge navigator.languages with navigator.language, keep navigator.language with higher priority
    let navigatorTags = [];
    if ('undefined' !== typeof this.navigator.language) {
      navigatorTags = navigatorTags.concat(navigator.language);
    }

    if ('undefined' !== typeof this.navigator.languages) {
      navigatorTags = navigatorTags.concat(navigator.languages);
    }

    // group language tags by language, keep region order
    const languageTags = this.groupTags(navigatorTags);

    // Detect the language and store it for later use.
    this.detectedLanguage = this.findLanguage(supportedLanguages, languageTags);
  }

  /**
   *
   * @param supportedLanguages - array of language tags to search in
   * @param languageTags - grouped language tags
   */
  protected findLanguage(supportedLanguages: Array<string>, languageTags: Array<Array<string | Array<string>>>): string {
    for (let i = 0; i < languageTags.length; i++) {
      let language, regions;
      [language, regions] = languageTags[i];

      // Find combination of language-region in supported Languages array
      let result = regions.find((region) => {
        const combinedTag = this.combineTag(language, region);
        return -1 !== supportedLanguages.findIndex(v => v === combinedTag);
      });

      if (result) {
        return this.combineTag(language, result);
      }

      // Same - for language only
      result = supportedLanguages.findIndex(v => this.splitTag(v)[0] === language);
      if (result) {
        return language;
      }
    }

    return undefined;
  }

  /**
   * Group languages tags by language, preserve regions order
   *
   * For example:
   * Initial languageTags array - ['en', 'he', 'en-EN', 'en-CA', 'he', 'en-GB', 'he-IL', 'ru]
   * After grouping:
   *  [
   *    ['en', ['EN', 'CA', 'GB']],
   *    ['he', ['IL']],
   *    ['ru', []],
   *  ]
   *
   * @param languageTags - array of language tags
   */
  protected groupTags(languageTags: Array<string>): Array<Array<string | Array<string>>> {

    return languageTags.reduce((collector, tag) => {
      let language: string, region: string;
      [language, region] = this.splitTag(tag);
      let index = collector.findIndex(v => v[0] === language);

      // add new [language, [...regions]]
      if (-1 === index) {
        collector.push([language, []]);
        index = collector.length - 1;
      }

      // Add region to regions array
      if (region) {
        collector[index][1].push(region);
      }

      return collector;
    }, []);
  }

  /**
   * Split language tag to [language, region]
   * @param tag - language tag
   */
  protected splitTag(tag: string) {
    return tag.split('-');
  }

  /**
   * Combine language and region to language tag
   *
   * @param language
   * @param region
   */

  protected combineTag(language: string, region: string) {
    if (!!region) {
      return language;
    }
    return language.concat('-', region);
  }

  public getLanguage(): Observable<string> {
    return of(this.detectedLanguage);
  }
}
