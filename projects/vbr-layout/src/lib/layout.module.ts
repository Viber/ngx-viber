import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TranslateModule } from '@ngx-translate/core';
import { VbrTranslateModule } from '@viberlab/translate';
import { VbrContentComponent } from './content/content.component';
import { VbrFooterComponent } from './footer/footer.component';
import { VbrHeaderComponent } from './header/header.component';
import { VbrLanguagesSwitchComponent } from './languages-switch/languages-switch.component';
import { VbrPageNotFoundComponent } from './page-not-found/page-not-found.component';
import { VbrPageComponent } from './page/page.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatSelectModule,
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
