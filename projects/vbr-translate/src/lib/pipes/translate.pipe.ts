import {
  ChangeDetectorRef, Inject, Optional, Pipe,
  PipeTransform
} from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { VBR_TRANSLATE_PREFIX } from '../tokens';

/**
 * Upgraded version of ngx-translate Translate Pipe
 *
 * Allows not to specify full path to translation string when provided with TRANSLATE_PREFIX in component.
 *
 * Pipe concat VBR_TRANSLATE_PREFIX with provided translation string and use the final string for translation.
 * Translation string should start with "." to benefit from such functionality,
 * otherwise it will be handled as regular string for translation.
 *
 * Example:
 *
 * Instead of
 * <h1>{{'content.screen.title' | translate}}</h1>
 * <p class="first">{{'content.screen.line' | translate}}</p>
 *
 * In your Component add to providers:
 *   providers: [
 *     {provide: VBR_TRANSLATE_PREFIX, useValue: 'content.screen'},
 *   ]
 *
 * So in component template next structure could be used
 * <h1>{{'.title' | vbrTranslate}}</h1>
 * <p class="first">{{'.line' | vbrTranslate}}</p>
 *
 */
@Pipe({
  name: 'vbrTranslate',
  pure: false
})
export class VbrTranslatePipe extends TranslatePipe implements PipeTransform {

  constructor(translate: TranslateService,
              _ref: ChangeDetectorRef,
              @Optional() @Inject(VBR_TRANSLATE_PREFIX) private prefix: string
  ) {
    super(translate, _ref);
  }

  private composeTranslationKey(value): string {
    if (!!this.prefix && !!value && value[0] === '.') {
      return this.prefix.concat(value);
    }

    return value;
  }

  transform(value: any, ...args: any[]): any {
    return super.transform(this.composeTranslationKey(value), ...args);
  }

}
