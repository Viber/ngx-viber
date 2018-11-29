import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VbrImagePreloaderDirective } from './directives/image-preloader.directive';
import { VbrSquircleComponent } from './components/squircle/vbr-squircle.component';
import { VbrSquircleIconComponent } from './components/squircle-icon/squircle-icon.component';
import {
  VBR_NAVIGATOR_TOKEN,
  VBR_WINDOW,
} from './constants';
import { HttpClientModule } from '@angular/common/http';

export function getNavigator(): Navigator {
  return navigator;
}

export function getWindow(): Window {
  return window;
}

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
    {
      provide: VBR_NAVIGATOR_TOKEN,
      useFactory: getNavigator,
    },
    {
      provide: VBR_WINDOW,
      useFactory: getWindow,
    },
  ],
})
export class VbrSquircleModule {
}
