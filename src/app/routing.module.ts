import { NgModule } from '@angular/core';
import {
  RouterModule,
  Routes,
} from '@angular/router';
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
