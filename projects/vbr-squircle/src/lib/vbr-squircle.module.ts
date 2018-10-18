import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VbrImagePreloaderDirective } from './directives/image-preloader.directive';
import { VbrSquircleComponent } from './components/squircle/vbr-squircle.component';
import { VbrSquircleIconComponent } from './components/squircle-icon/squircle-icon.component';
import { VBR_NAVIGATOR_TOKEN, VBR_WINDOW } from './constants';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
  ],
  declarations: [
    VbrImagePreloaderDirective,
    VbrSquircleComponent,
    VbrSquircleIconComponent,
  ],
  exports: [
    VbrImagePreloaderDirective,
    VbrSquircleComponent,
    VbrSquircleIconComponent,
  ],
  providers: [
    {provide: VBR_NAVIGATOR_TOKEN, useValue: navigator},
    {provide: VBR_WINDOW, useValue: window}
  ]
})
export class VbrSquircleModule {
}
