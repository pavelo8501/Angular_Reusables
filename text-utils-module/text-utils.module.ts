import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormGroupDirective, FormControl, NgForm, Validators, FormsModule, ReactiveFormsModule, FormBuilder, FormGroup} from '@angular/forms';

import { SelectablePartsInputComponent } from './selectable-parts-input/selectable-parts-input.component'; 


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    SelectablePartsInputComponent
  ],
  exports:[
    SelectablePartsInputComponent
  ]
})
export class TextUtilsModule { }
