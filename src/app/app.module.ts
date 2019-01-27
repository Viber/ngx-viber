import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
} from '@angular/material';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { VbrTranslateModule } from '../../projects/vbr-translate/src/lib/translate.module';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { VbrTranslateDemoComponent } from './translate-demo/translate-demo.component';
import { AppRoutingModule } from './routing.module';
import { VbrAdjustTextModule } from '../../projects/vbr-text-adjust/src/lib/vbr-adjust-text.module';

@NgModule({
  declarations: [
    AppComponent,
    VbrTranslateDemoComponent,
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
    AppRoutingModule,
    VbrAdjustTextModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(translate: TranslateService) {
    translate.setDefaultLang('en');
    translate.setTranslation('en', {
      start: {
        end: 'Translation without parameter',
        parameter: 'Translation with parameter: {{super}}',
      },
    });
    translate.setTranslation('ru', {
      start: {
        end: 'Перевод без параметра',
        parameter: 'Перевод с параметром: {{super}}',
      },
    });
  }
}
