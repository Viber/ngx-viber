import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule, MatListModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import {
  VbrSidenavMenuComponent,
  VbrSidenavMenuLinkComponent,
  VbrSidenavMenuUrlLinkComponent,
} from './components';
import { VbrHideSecureDirective } from './directives/secured.directive';
import { AsyncOrNotPipe } from './pipes/async-or-not.pipe';

@NgModule({
  imports: [
    CommonModule,
    MatListModule,
    MatIconModule,
    RouterModule,
  ],
  declarations: [
    VbrSidenavMenuComponent,
    VbrSidenavMenuLinkComponent,
    VbrSidenavMenuUrlLinkComponent,
    VbrHideSecureDirective,
    AsyncOrNotPipe,
  ],
  exports: [
    VbrSidenavMenuComponent,
    VbrHideSecureDirective,
  ]
})

export class VbrSidenavMenuModule {

}
