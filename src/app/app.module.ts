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
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { VbrInputKeyboardModule, } from '@viberlab/input-keyboard';
import { VbrPulsarService } from '@viberlab/pulsar';
import { VbrTranslateModule, VbrLanguageInfoService } from '@viberlab/translate';
import { VbrTranslatePipeModule } from '@viberlab/translate-pipe';
import { VbrLayoutModule } from '@viberlab/layout';

import { AppComponent } from './app.component';
import { VbrInputKeyboardDemoComponent } from './input-keyboard-demo/input-keyboard-demo.component';
import { VbrLayoutDemoComponent } from './layout-demo/layout-demo.component';
import { VbrPulsarDemoComponent } from './pulsar-demo/pulsar-demo.component';
import { AppRoutingModule } from './routing.module';
import { VbrTranslateDemoComponent } from './translate-demo/translate-demo.component';

@NgModule({
  declarations: [
    AppComponent,
    VbrTranslateDemoComponent,
    VbrPulsarDemoComponent,
    VbrInputKeyboardDemoComponent,
    VbrLayoutDemoComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    TranslateModule.forRoot(),
    VbrTranslateModule.forRoot(),
    VbrTranslatePipeModule,
    VbrInputKeyboardModule,
    VbrLayoutModule,
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
    translate.setTranslation('ru', {
      start: {
        end: 'Перевод без параметра',
        parameter: 'Перевод с параметром: {{super}}'
      }
    });
  }
}
