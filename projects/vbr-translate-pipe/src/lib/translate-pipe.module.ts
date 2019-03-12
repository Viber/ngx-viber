import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { VbrTranslatePipe } from './pipes/translate.pipe';


@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
  ],
  declarations: [
    VbrTranslatePipe,
  ],
  exports: [
    VbrTranslatePipe,
  ]
})

export class VbrTranslatePipeModule {
}
