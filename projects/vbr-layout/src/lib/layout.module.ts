import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatButtonModule,
  MatChipsModule,
  MatIconModule,
  MatInputModule,
  MatSelectModule,
  MatToolbarModule
} from '@angular/material';
import { VbrContentComponent } from './content/content.component';
import { VbrPageComponent } from './page/page.component';
import { VbrHeaderComponent } from './header/header.component';
import { VbrPageNotFoundComponent } from './page-not-found/page-not-found.component';
import { VbrFooterComponent } from './footer/footer.component';
import { TranslateModule } from '@ngx-translate/core';
import { VbrLanguagesSwitchComponent } from './languages-switch/languages-switch.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VbrTranslateModule } from '../../../vbr-translate/src/lib/translate.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatToolbarModule,
    MatIconModule,
    MatInputModule,
    MatChipsModule,
    MatButtonModule,
    TranslateModule,
    VbrTranslateModule,
  ],
  declarations: [
    VbrContentComponent,
    VbrPageComponent,
    VbrHeaderComponent,
    VbrFooterComponent,
    VbrPageNotFoundComponent,
    VbrLanguagesSwitchComponent,
  ],
  exports: [
    VbrContentComponent,
    VbrPageComponent,
    VbrHeaderComponent,
    VbrFooterComponent,
    VbrPageNotFoundComponent,
    VbrLanguagesSwitchComponent,
  ]
})
export class VbrLayoutModule {
}
