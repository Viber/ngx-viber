import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule, MatListModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { VbrHideSecureDirective } from './directives/secured.directive';
import { AsyncOrNotPipe } from './pipes/async-or-not.pipe';
import { VbrSidenavMenuComponent } from './components/menu/vbr-sidenav-menu.component';
import { VbrSidenavMenuLinkComponent } from './components/link/vbr-sidenav-menu-link.component';
import { VbrSidenavMenuUrlLinkComponent } from './components/url-link/vbr-sidenav-menu-url-link.component';

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
