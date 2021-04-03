import { CommonModule} from '@angular/common';

import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { NgxMaskModule } from 'ngx-mask'

import { ClienteDeleteComponent } from './cliente-delete/cliente-delete.component';
import { ClienteDetalheComponent } from './cliente-detalhe/cliente-detalhe.component';
import { ClientesRoutingModule } from './clientes-routing.module';
import { ClienteComponent } from './cliente/cliente.component';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';



@NgModule({
  declarations: [
    ClienteComponent,
    ClienteDeleteComponent,
    ClienteDetalheComponent


  ],
  imports: [
    CommonModule,
    ClientesRoutingModule,
    MatButtonModule,
    BrowserAnimationsModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatDialogModule,
    MatIconModule,
    MatDividerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatTabsModule,
    MatTableModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatProgressSpinnerModule,
    NgxMaskModule.forRoot(),
    MatPaginatorModule,
    
  ],
  exports: [
    ClienteComponent,
    ClienteDeleteComponent,
    ClienteDetalheComponent
  ]
})
export class ClientesModule {

}
