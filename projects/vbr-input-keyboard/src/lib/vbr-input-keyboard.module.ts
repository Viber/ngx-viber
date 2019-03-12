import { NgModule } from '@angular/core';
import { VbrInputKeyboardFilterDirective } from './vbr-input-keyboard-filter.directive';
import { VbrInputKeyboardReplaceDirective } from './vbr-input-keyboard-replace.directive';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [
    VbrInputKeyboardFilterDirective,
    VbrInputKeyboardReplaceDirective
  ],
  exports: [
    VbrInputKeyboardFilterDirective,
    VbrInputKeyboardReplaceDirective
  ]
})
export class VbrInputKeyboardModule {
}
