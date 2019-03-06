import { NgModule } from '@angular/core';
import {
  RouterModule,
  Routes,
} from '@angular/router';
import { VbrRequestDetectorDemoComponent } from './request-detector-demo/request-detector.component';
import { VbrTranslateDemoComponent } from './translate-demo/translate-demo.component';

const routes: Routes = [
  {
    path: 'translate-pipe',
    component: VbrTranslateDemoComponent
  },
  {
    path: 'request-detector',
    component: VbrRequestDetectorDemoComponent
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
