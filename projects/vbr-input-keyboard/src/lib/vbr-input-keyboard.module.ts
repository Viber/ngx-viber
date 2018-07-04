import { NgModule } from '@angular/core';
import { VbrInputKeyboardFilterDirective } from './vbr-input-keyboard-filter.directive';
import { VbrInputKeyboardReplaceDirective } from './vbr-input-keyboard-replace.directive';

@NgModule({
  imports: [
  ],
  declarations: [VbrInputKeyboardFilterDirective, VbrInputKeyboardReplaceDirective],
  exports: [VbrInputKeyboardFilterDirective, VbrInputKeyboardReplaceDirective]
})
export class VbrInputKeyboardModule { }
