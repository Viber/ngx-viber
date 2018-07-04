import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { NgControl } from '@angular/forms';
import { AllowedKeyCodes, SpecialKeys } from './constants';

@Directive({
  selector: '[vbrInputKeyboardFilter]',
})
export class VbrInputKeyboardFilterDirective {
  @Input() vbrInputKeyboardFilter: RegExp;

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

    let filteredText = '';
    for (let i = 0; i < newText.length; i++) {
      if ((textBefore.concat(filteredText, newText[i], textAfter)).match(this.vbrInputKeyboardFilter)) {
        filteredText = filteredText.concat(newText[i]);
      }
    }

    // insert text manually by updating model to trigger msd-elastic directive
    this.ngControl.control.setValue(textBefore.concat(filteredText, textAfter));
    //
    // // move cursor to correct position after paste
    setTimeout(() => {
      el.selectionStart = el.selectionEnd = origSelectionStart + filteredText.length;
    }, 0);
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
    // We need this because the current value on the DOM element
    // is not yet updated with the value from this event
    const next: string = current.concat(key);
    if (next && !String(next).match(this.vbrInputKeyboardFilter) && window.getSelection().toString().length === 0) {
      event.preventDefault();
    }
  }

  constructor(private el: ElementRef, private ngControl: NgControl) {
  }
}
