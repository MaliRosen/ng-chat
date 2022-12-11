import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatListModule} from '@angular/material/list';
import {MatDialogModule} from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

const modules = [MatToolbarModule, MatButtonModule,MatListModule,MatDialogModule,MatInputModule,MatFormFieldModule];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
     ...modules
  ],
  exports:modules
})
export class MaterialModule { }
