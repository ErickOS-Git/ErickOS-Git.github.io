import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FornecedoresRoutingModule } from './fornecedores-routing.module';
import { FornecedorComponent } from './fornecedor/fornecedor.component';
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
import { TextMaskModule } from 'angular2-text-mask';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FornecedorDeleteComponent } from './fornecedor-delete/fornecedor-delete.component';

import { FornecedorDetalheComponent } from './fornecedor-detalhe/fornecedor-detalhe.component';



@NgModule({
  declarations: [FornecedorComponent, FornecedorDeleteComponent, FornecedorDetalheComponent],
  imports: [
    CommonModule,
    FornecedoresRoutingModule,
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
    TextMaskModule,
    MatPaginatorModule,
    MatSlideToggleModule,
    
  ],
  exports: [
    FornecedorComponent,
    FornecedorDeleteComponent,
    FornecedorDeleteComponent
  ]
})
export class FornecedoresModule { }
