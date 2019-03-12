import { NgModule } from '@angular/core';
import {
  RouterModule,
  Routes,
} from '@angular/router';
import { VbrInputKeyboardDemoComponent } from './input-keyboard-demo/input-keyboard-demo.component';
import { VbrLayoutDemoComponent } from './layout-demo/layout-demo.component';
import { VbrPulsarDemoComponent } from './pulsar-demo/pulsar-demo.component';
import { VbrSidenavMenuDemoComponent } from './sidenav-menu-demo/vbr-sidenav-menu-demo.component';
import { VbrSquircleDemoComponent } from './squircle-demo/vbr-squircle-demo.component';
import { VbrTranslateDemoComponent } from './translate-demo/translate-demo.component';

const routes: Routes = [
  {
    path: 'translate-pipe',
    component: VbrTranslateDemoComponent
  },
  {
    path: 'pulsar',
    component: VbrPulsarDemoComponent
  },
  {
    path: 'input-keyboard',
    component: VbrInputKeyboardDemoComponent
  },
  {
    path: 'layout',
    component: VbrLayoutDemoComponent
  },
  {
    path: 'sidenav-menu',
    component: VbrSidenavMenuDemoComponent
  },
  {
    path: 'squircle',
    component: VbrSquircleDemoComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule {
}
