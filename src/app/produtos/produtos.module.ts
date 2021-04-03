import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProdutosRoutingModule } from './produtos-routing.module';
import { ProdutoComponent } from './produto/produto.component';
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

import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { MatSelectModule } from '@angular/material/select';
import { ProdutoDetalheComponent } from './produto-detalhe/produto-detalhe.component';
import { ProdutoDeleteComponent } from './produto-delete/produto-delete.component';
import { NgxMaskModule } from 'ngx-mask';


@NgModule({
  declarations: [ProdutoComponent, ProdutoDetalheComponent, ProdutoDeleteComponent],
  imports: [
    CommonModule,
    ProdutosRoutingModule,
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
    
  ],
  exports: [
    ProdutoComponent,
    ProdutoDeleteComponent,
    ProdutoDetalheComponent
  ]
})
export class ProdutosModule { } 
