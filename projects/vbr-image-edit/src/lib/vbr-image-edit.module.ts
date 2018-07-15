import { NgModule } from '@angular/core';
import { VbrImageEditComponent } from './vbr-image-edit.component';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
  ],
  declarations: [VbrImageEditComponent],
  exports: [VbrImageEditComponent]
})
export class VbrImageEditModule { }
