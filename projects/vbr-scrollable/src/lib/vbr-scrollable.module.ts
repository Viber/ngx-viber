import { NgModule } from '@angular/core';
import { VbrScrollableComponent } from './vbr-scrollable.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ScrollItemDirective } from './scroll-item.directive';

@NgModule({
  declarations: [VbrScrollableComponent, ScrollItemDirective],
  imports: [
    PerfectScrollbarModule,
  ],
  exports: [VbrScrollableComponent, ScrollItemDirective],
})
export class VbrScrollableModule {
}
