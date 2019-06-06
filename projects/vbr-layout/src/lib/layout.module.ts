import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  MatButtonModule,
  MatChipsModule,
  MatIconModule,
  MatInputModule,
  MatSelectModule,
  MatToolbarModule,
} from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import { VbrTranslateModule } from '@viberlab/translate';
import { VbrContentComponent } from './content/content.component';
import { VbrFooterComponent } from './footer/footer.component';
import { VbrHeaderComponent } from './header/header.component';
import { VbrLanguagesSwitchComponent } from './languages-switch/languages-switch.component';
import { VbrPageNotFoundComponent } from './page-not-found/page-not-found.component';
import { VbrPageComponent } from './page/page.component';

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
