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
import { VbrTranslatePipeModule } from '@viberlab/translate-pipe';
import { VbrTranslateModule } from '@viberlab/translate';
import { VbrPulsarService } from '@viberlab/pulsar';

import { AppComponent } from './app.component';
import { VbrPulsarDemoComponent } from './pulsar-demo/pulsar-demo.component';
import { AppRoutingModule } from './routing.module';
import { VbrTranslateDemoComponent } from './translate-demo/translate-demo.component';

@NgModule({
  declarations: [
    AppComponent,
    VbrTranslateDemoComponent,
    VbrPulsarDemoComponent,
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
    VbrTranslateModule,
    VbrTranslatePipeModule,
    // VbrPulsarModule.forRoot(),
    AppRoutingModule
  ],
  providers: [
    VbrPulsarService
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
