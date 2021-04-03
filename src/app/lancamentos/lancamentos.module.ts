import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatRadioModule } from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {MatCheckboxModule} from '@angular/material/checkbox';

import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { LancamentosRoutingModule } from './lancamentos-routing.module';
import { LancamentoComponent } from './lancamento/lancamento.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatStepperModule } from '@angular/material/stepper';
import { MatStepper } from '@angular/material/stepper';
import { NgxMaskModule } from 'ngx-mask';
import {MatChipsModule} from '@angular/material/chips';



@NgModule({
  declarations: [LancamentoComponent],
  imports: [
    CommonModule,
    LancamentosRoutingModule,
    MatButtonModule,
    BrowserAnimationsModule,
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatDialogModule,
    MatIconModule,
    MatDividerModule,
    MatRadioModule,
    MatTabsModule,
    MatTableModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatProgressSpinnerModule,
    NgxMaskModule,
    MatPaginatorModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatAutocompleteModule,
    NgxMatSelectSearchModule,
    MatStepperModule,    
    MatCheckboxModule,
    MatChipsModule,   
  ],
  exports: [
    LancamentoComponent
  ]
})
export class LancamentosModule { }
