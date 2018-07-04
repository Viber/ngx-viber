import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { NgControl } from '@angular/forms';
import { AllowedKeyCodes, SpecialKeys } from './constants';

export type VbrInputReplaceType = [string | RegExp, (substring: string, ...args: any[]) => string];

@Directive({
  selector: '[vbrInputKeyboardReplace]',
})
export class VbrInputKeyboardReplaceDirective {
  @Input() vbrInputKeyboardReplace: Array<VbrInputReplaceType>;

  @HostListener('paste', ['$event'])
  onPaste(event /* : ClipboardEvent */) { // ClipboardEvent type is undefined in IE
    // actually typing on the element, stop paste propagation to outside paste handler
    event.stopPropagation();

    // intercept paste
    event.preventDefault();
    const newText = event.clipboardData.getData('text/plain');
    // merged the newly pasted text with original text
    const el = event.target as HTMLInputElement;

    const v = this.el.nativeElement.value;
    const textBefore = v.substring(0, el.selectionStart);
    const textAfter = v.substring(el.selectionEnd, v.length);
    const origSelectionStart = el.selectionStart;

    const transformedText = this.vbrInputKeyboardReplace
      .reduce((collector: string, [pattern, replacement]: VbrInputReplaceType) => collector.replace(pattern, replacement), newText);

    // insert text manually by updating model to trigger msd-elastic directive
    this.ngControl.control.setValue(textBefore.concat(transformedText, textAfter));

    // move cursor to correct position after paste
    const place = origSelectionStart + transformedText.length;
    this.el.nativeElement.setSelectionRange(place, place);
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // Do not use event.keyCode this is deprecated.
    // See: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode
    // * Added fallback to keyCode for older browsers
    const key: string = event.key || String.fromCharCode(event.keyCode);

    // Allow Backspace, tab, end, and home keys
    if (event.ctrlKey || SpecialKeys.indexOf(key) !== -1 || (!!event.keyCode && AllowedKeyCodes.indexOf(event.keyCode) !== -1)) {
      return;
    }

    const current: string = this.el.nativeElement.value;
    const target: HTMLInputElement = event.target as HTMLInputElement;
    const start = target && target.selectionStart;
    const end = target && target.selectionEnd;

    const transformed = this.vbrInputKeyboardReplace
      .reduce((collector: string, [pattern, replacement]: VbrInputReplaceType) => collector.replace(pattern, replacement), key);

    if (transformed !== key) {
      event.preventDefault();

      if (typeof start !== 'undefined') {
        this.el.nativeElement.value = current.slice(0, start) + transformed + current.slice(end);
        this.el.nativeElement.setSelectionRange(start + 1, start + 1);
      } else {
        this.el.nativeElement.value = this.el.nativeElement.value.concat(transformed);
      }
    }
  }

  constructor(private el: ElementRef, private ngControl: NgControl) {
  }
}
