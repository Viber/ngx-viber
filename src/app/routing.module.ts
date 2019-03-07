import { NgModule } from '@angular/core';
import {
  RouterModule,
  Routes,
} from '@angular/router';
import { VbrInputKeyboardDemoComponent } from './input-keyboard-demo/input-keyboard-demo.component';
import { VbrPulsarDemoComponent } from './pulsar-demo/pulsar-demo.component';
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
