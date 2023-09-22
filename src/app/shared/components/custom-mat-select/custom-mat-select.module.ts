import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomMatSelectComponent } from './custom-mat-select.component';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';



@NgModule({
  declarations: [
    CustomMatSelectComponent
  ],
  imports: [
    CommonModule,
    MatInputModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
  ],
  exports: [
    CustomMatSelectComponent
  ]
})
export class CustomMatSelectModule { }
