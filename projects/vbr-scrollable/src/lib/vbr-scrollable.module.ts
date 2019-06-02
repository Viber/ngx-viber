import { NgModule } from '@angular/core';
import { VbrScrollableComponent } from './vbr-scrollable.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

@NgModule({
  declarations: [VbrScrollableComponent],
  imports: [
    PerfectScrollbarModule,
  ],
  exports: [VbrScrollableComponent],
})
export class VbrScrollableModule {
}
