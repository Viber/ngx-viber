import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VbrChipsAutocompleteComponent } from './vbr-chips-autocomplete.component';
import { MatAutocompleteModule, MatChipsModule, MatIconModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatIconModule
  ],
  declarations: [VbrChipsAutocompleteComponent],
  exports: [VbrChipsAutocompleteComponent]
})
export class VbrChipsAutocompleteModule { }
