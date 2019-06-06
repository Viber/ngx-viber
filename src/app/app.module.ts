import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
} from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { VbrLayoutModule } from '@viberlab/layout';
import { VbrSquircleModule } from '@viberlab/squircle';

import { AppComponent } from './app.component';
import { VbrInputKeyboardDemoComponent } from './input-keyboard-demo/input-keyboard-demo.component';
import { VbrLayoutDemoComponent } from './layout-demo/layout-demo.component';
import { VbrPulsarDemoComponent } from './pulsar-demo/pulsar-demo.component';
import { AppRoutingModule } from './routing.module';
import { VbrTranslateDemoComponent } from './translate-demo/translate-demo.component';
import { VbrSidenavMenuDemoComponent } from './sidenav-menu-demo/vbr-sidenav-menu-demo.component';
import { VbrSquircleDemoComponent } from './squircle-demo/vbr-squircle-demo.component';
import { VbrPulsarService } from '../../projects/vbr-pulsar/src/lib/serives/vbr-pulsar.service';
import { VbrInputKeyboardModule } from '../../projects/vbr-input-keyboard/src/lib/vbr-input-keyboard.module';
import { VbrTranslateLoader } from '../../projects/vbr-translate-loader/src/lib/translate-loader';
import { VbrTranslateModule } from '../../projects/vbr-translate/src/lib/translate.module';
import { VbrTranslatePipeModule } from '../../projects/vbr-translate-pipe/src/lib/translate-pipe.module';
import { VbrSidenavMenuModule } from '../../projects/vbr-sidenav-menu/src/public_api';
import { VbrLanguageInfoService } from '../../projects/vbr-translate/src/lib/services/language-info.service';

@NgModule({
  declarations: [
    AppComponent,
    VbrTranslateDemoComponent,
    VbrPulsarDemoComponent,
    VbrInputKeyboardDemoComponent,
    VbrLayoutDemoComponent,
    VbrSidenavMenuDemoComponent,
    VbrSquircleDemoComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: ((http: HttpClient) => new VbrTranslateLoader(
          [new TranslateHttpLoader(http, 'assets/@viberlab/layout/translations/locale-', '.json')],
          true
        )),
        deps: [HttpClient]
      }
    }),
    VbrTranslateModule.forRoot(),
    VbrTranslatePipeModule,
    VbrInputKeyboardModule,
    VbrLayoutModule,
    VbrSidenavMenuModule,
    VbrSquircleModule,
    // VbrPulsarModule.forRoot(),
    AppRoutingModule
  ],
  providers: [
    VbrPulsarService,
    VbrLanguageInfoService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(translate: TranslateService) {
    translate.setDefaultLang('en');
    translate.setTranslation('en', {
      start: {
        end: 'Translation without parameter',
        parameter: 'Translation with parameter: {{super}}'
      }
    });
    // translate.setTranslation('ru', {
    //   start: {
    //     end: 'Перевод без параметра',
    //     parameter: 'Перевод с параметром: {{super}}'
    //   }
    // });
  }
}
