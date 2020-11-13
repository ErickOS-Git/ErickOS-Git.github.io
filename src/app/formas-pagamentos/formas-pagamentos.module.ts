import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormasPagamentosRoutingModule } from './formas-pagamentos-routing.module';
import { FormaPagamentoComponent } from './forma-pagamento/forma-pagamento.component';
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
import { MatButtonModule } from '@angular/material/button';
import { FormaPagamentoDeleteComponent } from './forma-pagamento-delete/forma-pagamento-delete.component';
import { FormaPagamentoDetalheComponent } from './forma-pagamento-detalhe/forma-pagamento-detalhe.component';
import { MatPaginatorModule } from '@angular/material/paginator';


@NgModule({
  declarations: [FormaPagamentoComponent, FormaPagamentoDeleteComponent, FormaPagamentoDetalheComponent],
  imports: [
    CommonModule,
    FormasPagamentosRoutingModule,
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
    MatButtonModule,
    MatRadioModule,
    MatPaginatorModule,
    
    

  ],
  exports: [
    FormaPagamentoComponent
  ]
})
export class FormasPagamentosModule { }
