import { VbrLanguageDetector } from './language-detector';
import { Observable, of } from 'rxjs';

export class VbrBrowserLangaugeDetector implements VbrLanguageDetector {
  readonly detectedLanguage: string;

  constructor(supportedLanguages: Array<string>, private navigator: Navigator) {
    // merge navigator.languages with navigator.language
    let navigatorTags = [];
    if ('undefined' !== typeof this.navigator.language) {
      navigatorTags = navigatorTags.concat(navigator.language);
    }

    if ('undefined' !== typeof this.navigator.languages) {
      navigatorTags = navigatorTags.concat(navigator.languages);
    }

    const languageTags = this.groupTags(navigatorTags);
    this.detectedLanguage = this.detectLanguage(supportedLanguages, languageTags);
  }

  protected detectLanguage(supportedLanguages: Array<string>, languageTags: Array<Array<string | Array<string>>>): string {
    for (let i = 0; i < languageTags.length; i++) {
      let language, regions;
      [language, regions] = languageTags[i];

      let result = regions.find((region) => {
        const combinedTag = this.combineTag(language, region);
        return -1 !== supportedLanguages.findIndex(v => v === combinedTag);
      });

      if (result) {
        return this.combineTag(language, result);
      }

      // Same for language only
      result = supportedLanguages.findIndex(v => this.splitTag(v)[0] === language);
      if (result) {
        return language;
      }
    }

    return undefined;
  }

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

  protected splitTag(tag: string) {
    return tag.split('-');
  }

  protected combineTag(language: string, region: string) {
    if (!!region) {
      return language;
    }
    return language.concat('-', region);
  }

  getLanguage(): Observable<string> {
    return of(this.detectedLanguage);
  }
}
