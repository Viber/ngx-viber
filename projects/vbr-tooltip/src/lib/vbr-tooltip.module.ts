import { NgModule } from '@angular/core';
import { VbrTooltipComponent } from './vbr-tooltip.component';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  imports: [CommonModule, BrowserModule],
  declarations: [VbrTooltipComponent],
  exports: [VbrTooltipComponent]
})
export class VbrTooltipModule {
}
